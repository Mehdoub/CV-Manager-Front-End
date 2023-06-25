// ** React Imports
import { ReactNode, useEffect, useState } from 'react'

// ** Next Imports
import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports

import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'
import 'src/configs/i18n'

// ** Fake-DB Import
import 'src/@fake-db'

// ** Third Party Import
import { Toaster, toast } from 'react-hot-toast'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import AclGuard from 'src/@core/components/auth/AclGuard'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import AuthGuard from 'src/@core/components/auth/AuthGuard'
import GuestGuard from 'src/@core/components/auth/GuestGuard'
import WindowWrapper from 'src/@core/components/window-wrapper'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Contexts
import { AuthProvider } from 'src/context/AuthContext'
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** Prismjs Styles
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

import 'src/iconify-bundle/icons-bundle-react'

// ** Global css styles
import '../../styles/globals.css'
import { Provider } from 'react-redux'
import { store } from 'src/store'
import { Icon } from '@iconify/react'
import Language from 'src/helpers/Language'

import CustomToast from 'src/views/common/CustomToast'
import ErrorBoundary from './ErrorBoundary'
import Error500 from './500'
// import BetaTag from 'src/@core/layouts/components/shared-components/footer/BetaTag'

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  }
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  const router = useRouter()
  let title = router.pathname.substring(1, 2).toUpperCase() + router.pathname.substring(2)
  title = title.split('/')[0]

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false
  const getLayout =
    Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>)

  const setConfig = Component.setConfig ?? undefined

  const authGuard = Component.authGuard ?? true

  const guestGuard = Component.guestGuard ?? false

  const aclAbilities = Component.acl ?? defaultACLObj
  let navigatorIsOnline
  if (typeof window !== 'undefined') {
    navigatorIsOnline = window.navigator.onLine
  }
  const [isOnline, setIsOnline] = useState(navigatorIsOnline)
  const [wasOnline, setWasOnline] = useState(navigatorIsOnline)

  useEffect(() => {
    const language = Language.builder().getLanguage()
    Language.builder().changeDirection(language)
  }, [])

  useEffect(() => {
    const handleConnStateChange = () => {
      if (isOnline !== window.navigator.onLine) {
        setWasOnline(isOnline)
        setIsOnline(window.navigator.onLine)
      }
    }
    window.addEventListener('online', handleConnStateChange)
    window.addEventListener('offline', handleConnStateChange)

    toast.dismiss()
    if (isOnline && !wasOnline) {
      toast(() => <CustomToast title={'you back to online!'} body={'you can make changes now'} color={'#fff'} />, {
        icon: <Icon fontSize={'30px'} icon='mdi:access-point-check' />,
        duration: 5000,
        position: 'bottom-left',
        style: {
          borderRadius: '10px',
          background: '#787EFF',
          color: '#fff'
        }
      })
    } else if (!isOnline) {
      toast(
        () => (
          <CustomToast
            title={'you are offline!'}
            body={'your changes will not be saved'}
            color={'rgb(106 106 106 / 87%)'}
          />
        ),
        {
          icon: <Icon fontSize={'30px'} icon='mdi:access-point-remove' />,
          duration: 18600000,
          position: 'bottom-left',
          style: {
            borderRadius: '10px',
            background: '#fff',
            color: 'rgba(76, 78, 100, 0.87)'
          }
        }
      )
    }

    return () => {
      window.removeEventListener('online', handleConnStateChange)
      window.removeEventListener('offline', handleConnStateChange)
    }
  }, [isOnline])

  // Below Code Commented Temporarily

  // // Blocking Right Click
  // document.addEventListener('contextmenu', e => e.preventDefault())

  // document.onkeydown = ev => {
  //   if (ev.keyCode == 123) {
  //     // Blocking F12
  //     return false
  //   } else if (ev.shiftKey && ev.ctrlKey) {
  //     return false
  //   }
  // }

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>{`${themeConfig.templateName}${title ? ' - ' + title : ''}`}</title>
          <meta
            name='description'
            content={`${themeConfig.templateName} – A System Form Manage Resumes And positions.`}
          />
          <meta name='keywords' content='CV-manager, CV, Resume' />
          <meta name='viewport' content='initial-scale=1, width=device-width' />
        </Head>

        <AuthProvider>
          <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
            <SettingsConsumer>
              {({ settings }) => {
                return (
                  <ThemeComponent settings={settings}>
                    <WindowWrapper>
                      <ErrorBoundary fallback={<Error500 />}>
                        <Guard authGuard={authGuard} guestGuard={guestGuard}>
                          <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard}>
                            {getLayout(<Component {...pageProps} />)}
                            {/* <BetaTag /> */}
                          </AclGuard>
                        </Guard>
                      </ErrorBoundary>
                    </WindowWrapper>
                    <ReactHotToast>
                      <Toaster
                        position={settings.toastPosition}
                        toastOptions={{ className: 'react-hot-toast' }}
                        containerStyle={{ zIndex: '10000 !important' }}
                      />
                    </ReactHotToast>
                  </ThemeComponent>
                )
              }}
            </SettingsConsumer>
          </SettingsProvider>
        </AuthProvider>
      </CacheProvider>
    </Provider>
  )
}

export default App
