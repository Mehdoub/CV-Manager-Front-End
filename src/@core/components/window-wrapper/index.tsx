// ** React Imports
import { useState, useEffect, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { getNotifications } from 'src/store/profile'
import { useSelector } from 'react-redux'
import Favicon from 'react-favicon'

interface Props {
  children: ReactNode
}

const WindowWrapper = ({ children }: Props) => {
  // ** State
  const [windowReadyFlag, setWindowReadyFlag] = useState<boolean>(false)
  const [notificationCount, setNotificationCount] = useState<number>(0)

  const router = useRouter()

  const dispatch = useDispatch()

  const { data: notifications } = useSelector((state: any) => state.profileNotifications)
  const { status: notificationsSeenStatus } = useSelector((state: any) => state.profileNotificationsSeen)

  useEffect(() => {
    setNotificationCount(notificationsSeenStatus ? 0 : notifications?.totalDocs)
    console.log('notifications: ', notifications)
  }, [notifications, notificationsSeenStatus])

  useEffect(() => {
    const channel = new window.BroadcastChannel('sw-messages')
    channel.addEventListener('message', event => {
      console.log('dispatched')
      dispatch(getNotifications({ state: 'unread', size: 7, page: 1 }))
    })
  }, [])

  useEffect(
    () => {
      if (typeof window !== 'undefined') {
        setWindowReadyFlag(true)
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  )

  if (windowReadyFlag) {
    return (
      <>
        {typeof window != 'undefined' && <Favicon url='/images/favicon.png' alertCount={notificationCount} />}
        {children}
      </>
    )
  } else {
    return null
  }
}

export default WindowWrapper
