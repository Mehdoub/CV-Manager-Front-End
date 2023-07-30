// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, RegisterParams, LoginParams, ErrCallbackType } from './types'
import ApiRequest from 'src/helpers/ApiRequest'
import { useDispatch } from 'react-redux'
import { getConstants } from 'src/store/common'
import FirebaseCloudMessaging from 'src/helpers/FirebaseCloudMessaging'
import { notificationIsGranted, toastError } from 'src/helpers/functions'
import { getProvinces } from 'src/store/province'
import { clearProfileNotificationsSeen, getNotifications } from 'src/store/profile'
import * as Sentry from '@sentry/nextjs';

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  getUserData: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [clientToken, setClientToken] = useState<string>('')

  // ** Hooks
  const router = useRouter()
  const dispatch = useDispatch()

  const updateNotifications = () => {
    dispatch(clearProfileNotificationsSeen())
    dispatch(getNotifications({ size: 7, page: 1, state: 'unread' }))
  }

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      setLoading(true)
      getUserData()
      const fcm = await FirebaseCloudMessaging.builder()
      fcm && fcm?.onMessageListener(updateNotifications)
    }
    initAuth()
  }, [])

  const isClientTokenDuplicate = (token: string, subjectUser: any) => {
    const fcmtokens =
      subjectUser?.fcmtokens?.length > 0 ? subjectUser?.fcmtokens?.map((fcmtoken: any) => fcmtoken?.token) : []
    return fcmtokens.includes(token)
  }

  const patchClientToken = async () => {
    if (user?._id) {
      if (clientToken && !isClientTokenDuplicate(clientToken, user) && notificationIsGranted()) {
        try {
          await ApiRequest.builder().auth().request('patch', `users/${user?._id}/fcm-token`, { token: clientToken })
        } catch (err: any) {
          toastError('An Error Occurred While Sending FCM Token!')
        }
      }
    }
  }

  const deleteFcmToken = async () => {
    try {
      if (clientToken && notificationIsGranted()) {
        const fcm = await FirebaseCloudMessaging.builder()
        fcm && (await fcm?.deleteRegistrationToken(setClientToken))
        await ApiRequest.builder().auth().request('delete', `users/${user._id}/fcm-token`, { token: clientToken })
      }
    } catch (error) {
      toastError('An Error Occurred While Deleting FCM Token!')
    }
  }

  useEffect(() => {
    patchClientToken()
  }, [clientToken, user])

  const clearLogin = () => {
    setLoading(false)
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    window.localStorage.removeItem(authConfig.refreshTokenKeyName)

    setUser(null)
    Sentry.setUser(null)
    const completePath = window.location.href
    const originPath = window.location.origin
    const returnUrl = completePath.split(originPath)[1]
    const returnUrlQuery = returnUrl ? '?returnUrl=' + returnUrl : ''
    if (!['/login', '/register', '/forgot-password'].includes(router.pathname)) {
      router.replace('/login' + returnUrlQuery)
    }
  }

  const getUserData = async () => {
    if (localStorage.getItem('accessToken')) {
      try {
        const result = await ApiRequest.builder().auth().request('get', 'profile/get-me')

        const userData = { ...result.data.data[0] }

        setUser(userData)
        Sentry.setUser({
          id: userData?._id,
          username: userData?.username,
          email: userData?.email ?? null
        })
      } catch (err) {
        clearLogin()
        toastError('There Is A Problem On Authentication')
      }
      const fcm = await FirebaseCloudMessaging.builder()
      fcm && fcm?.fetchToken(setClientToken)
      setLoading(false)
      dispatch(getConstants())
      dispatch(getProvinces())
    } else {
      deleteFcmToken()
      clearLogin()
    }
  }

  const handleLogin = async (params: LoginParams, errorCallback?: ErrCallbackType) => {
    try {
      const response = await ApiRequest.builder().request('post', 'auth/login', params)

      localStorage.setItem(authConfig.storageTokenKeyName, response.data.data[0].access_token)
      localStorage.setItem(authConfig.refreshTokenKeyName, response.data.data[0].refresh_token)

      const returnUrl = router.query.returnUrl
      getUserData()

      const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

      router.replace(redirectURL as string)
    } catch (err: any) {
      if (errorCallback) errorCallback(err)
    }
  }

  const handleLogout = async () => {
    try {
      await deleteFcmToken()
      await ApiRequest.builder().auth().request('post', 'auth/logout')

    } catch (err: any) {
      // toastError('An Error Occurred While Logout')
    }
    clearLogin()
    window.location.href = '/login'
  }

  const handleRegister = async (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    try {
      const response = await ApiRequest.builder().auth().request('post', 'auth/signup', params)
      if (response.data.data[0].access_token) {
        localStorage.setItem(authConfig.storageTokenKeyName, response.data.data[0].access_token)
        localStorage.setItem(authConfig.refreshTokenKeyName, response.data.data[0].refresh_token)

        getUserData()

        router.replace('/verification')
      }
    } catch (err: any) {
      if (errorCallback) errorCallback(err)
    }
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    getUserData
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
