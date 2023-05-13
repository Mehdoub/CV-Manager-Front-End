// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, RegisterParams, LoginParams, ErrCallbackType, UserDataType } from './types'
import ApiRequest from 'src/helpers/ApiRequest'
import { useDispatch } from 'react-redux'
import { getConstants } from 'src/store/common'
import FirebaseCloudMessaging from 'src/pages/FirebaseCloudMessaging'
import { toast } from 'react-hot-toast'
import CustomToast from 'src/views/common/CustomToast'
import { getColorCodes, toastError } from 'src/helpers/functions'

import { Icon } from '@iconify/react'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [clientToken, setClientToken] = useState<string>('')

  // ** Hooks
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const fcm = FirebaseCloudMessaging.builder()
      setLoading(true)
      getUserData()
      fcm
        .onMessageListener()
        .then((payload: any) => {
          toast(
            () => (
              <CustomToast title={payload?.notification?.title} body={payload?.notification?.body} color={'#fff'} />
            ),
            {
              duration: 10000,
              style: {
                borderRadius: '10px',
                background: getColorCodes('info'),
                color: '#fff'
              },
              icon: <Icon fontSize={'30px'} icon='material-symbols:info-outline' />
            }
          )
        })
        .catch(err => toastError('notification show failed!'))
    }
    initAuth()
  }, [])

  const patchClientToken = async () => {
    if (user?._id) {
      const fcmtokens = user?.fcmtokens?.length > 0 ? user?.fcmtokens?.map((fcmtoken: any) => fcmtoken?.token) : []
      if (clientToken && !fcmtokens.includes(clientToken)) {
        if (clientToken)
          await ApiRequest.builder().auth().request('patch', `users/${user?._id}/fcm-token`, { token: clientToken })
      }
    }
  }

  useEffect(() => {
    patchClientToken()
  }, [clientToken, user])

  const clearLogin = () => {
    setLoading(false)

    localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    window.localStorage.removeItem(authConfig.refreshTokenKeyName)

    setUser(null)
    const completePath = window.location.href
    const originPath = window.location.origin
    const returnUrl = completePath.split(originPath)[1]
    let routerObj: any = { pathname: '/login' }
    if (!['/login', '/register', '/forgot-password'].includes(router.pathname)) routerObj.query = { returnUrl }
    router.replace(routerObj)
  }

  const getUserData = async () => {
    if (localStorage.getItem('accessToken')) {
      try {
        const result = await ApiRequest.builder().auth().request('get', 'users/get-me')

        const userData = { ...result.data.data[0] }

        setUser(userData)
        const fcm = FirebaseCloudMessaging.builder()
        fcm.fetchToken(setClientToken)
        setLoading(false)
        localStorage.setItem('userData', JSON.stringify(userData))
        dispatch(getConstants())
      } catch (err) {
        clearLogin()
      }
    } else {
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
    if (clientToken) {
      FirebaseCloudMessaging.builder().deleteRegistrationToken(setClientToken)
      await ApiRequest.builder()
        .auth()
        .request('delete', `users/${user._id}/fcm-token`, { token: clientToken })
        .catch(() => {
          toastError('an error occurred while deleting client token!')
        })
    }
    await ApiRequest.builder().auth().request('post', 'auth/logout')

    clearLogin()
    router.push('/login')
  }

  const handleRegister = async (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    try {
      const response = await ApiRequest.builder().auth().request('post', 'auth/signup', params)
      if (response.data.data[0].access_token) {
        localStorage.setItem(authConfig.storageTokenKeyName, response.data.data[0].access_token)
        localStorage.setItem(authConfig.refreshTokenKeyName, response.data.data[0].refresh_token)

        const returnUrl = router.query.returnUrl
        getUserData()

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace(redirectURL as string)
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
    register: handleRegister
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
