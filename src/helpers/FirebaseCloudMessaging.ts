import { initializeApp } from 'firebase/app'
import { deleteToken, getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'
import { notificationIsSupported, toastError } from 'src/helpers/functions';
import showNotificationToast from './showNotificationToast';
import firebaseConfig from 'firebaseConfig.json'

export default class FirebaseCloudMessaging {
  private firebaseConfig: any
  private firebaseApp: any
  private messaging: any
  private vapidKey: string = ''
  public registrationToken: string = ''
  public constructor() {
    this.firebaseConfig = firebaseConfig;
    this.vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY as string
    this.firebaseApp = initializeApp(this.firebaseConfig)
    this.messaging = getMessaging(this.firebaseApp)
  }

  static async builder() {
    const messagingIsSupported = await this.fcmIsSupported()
    if (
      typeof navigator.serviceWorker !== 'undefined'
      && messagingIsSupported
    ) return new FirebaseCloudMessaging()
  }

  static async fcmIsSupported() {
    const res = await isSupported().then((result) => result).catch(() => false)
    return res
  }

  public fetchToken = async (setClientToken?: (token: string) => void) => {
    return getToken(this.messaging, { vapidKey: this.vapidKey }).then((currentToken) => {
      if (currentToken) {
        this.registrationToken = currentToken
        if (setClientToken) {
          setClientToken(currentToken)
        }
        return currentToken
      } else {
        toastError('No registration token available. Request permission to generate one.');
      }
    }).catch(() => {
      if (notificationIsSupported() && Notification.permission == 'granted') toastError('An error occurred while retrieving FCM Registration Token.');
    });
  }

  public onMessageListener = (updateNotifications: any) => onMessage(this.messaging, (payload: any) => {
    console.log('Notification Data From Firebase On Foreground: ', payload)
    const { title, body } = payload?.data
    showNotificationToast(title, body)
    updateNotifications()
  })

  public deleteRegistrationToken = async (setClientToken: (token: string) => void) => {
    deleteToken(this.messaging).then(() => setClientToken('')).catch(() => {
      if (notificationIsSupported() && Notification.permission == 'granted') toastError('An error occurred while Deleting FCM Registration Token.');
    })
  }
}
