import { initializeApp } from 'firebase/app'
import { deleteToken, getMessaging, getToken, onMessage } from 'firebase/messaging'
import { toastError } from 'src/helpers/functions';
import showNotificationToast from './showNotificationToast';

export default class FirebaseCloudMessaging {
  private firebaseConfig: any
  private firebaseApp: any
  private messaging: any
  private vapidKey: string = ''
  public registrationToken: string = ''
  public constructor() {
    this.firebaseConfig = {
      apiKey: "AIzaSyAtUpRosHz_Bd7OFDThWLwfx4xohyk8oUM",
      authDomain: "testing-push-6bfd8.firebaseapp.com",
      projectId: "testing-push-6bfd8",
      storageBucket: "testing-push-6bfd8.appspot.com",
      messagingSenderId: "823246048795",
      appId: "1:823246048795:web:b0aadd98ea28776393b2be"
    };
    this.vapidKey = 'BBythEP4Jfoo-s6D9pyiQ2xdEmOZtIyvWjQyJG5jv4av5Neb2IBXd31zMFPEIpiHh_vrUWEObYONu4WnscEK3Xs'
    this.firebaseApp = initializeApp(this.firebaseConfig)
    this.messaging = getMessaging(this.firebaseApp)
  }

  static builder() {
    if (typeof navigator.serviceWorker !== 'undefined') return new FirebaseCloudMessaging()
  }

  public fetchToken = async (setClientToken?: (token: string) => void) => {
    return getToken(this.messaging, { vapidKey: this.vapidKey }).then((currentToken) => {
      if (currentToken) {
        this.registrationToken = currentToken
        if (setClientToken) {
          setClientToken(currentToken)
        }
        console.log('currentToken: ', currentToken)
        return currentToken
      } else {
        toastError('No registration token available. Request permission to generate one.');
      }
    }).catch(() => {
      if (Notification.permission == 'granted') toastError('An error occurred while retrieving FCM Registration Token.');
    });
  }

  public onMessageListener = () => onMessage(this.messaging, (payload) => {
    showNotificationToast(payload?.notification?.title as string, payload?.notification?.body as string)
  })

  public deleteRegistrationToken = async (setClientToken: (token: string) => void) => {
    deleteToken(this.messaging).then(() => setClientToken('')).catch(() => {
      if (Notification.permission == 'granted') toastError('An error occurred while Deleting FCM Registration Token.');
    })
  }
}
