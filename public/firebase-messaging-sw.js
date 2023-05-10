importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-messaging-compat.js')

const firebaseConfig = {
  apiKey: 'AIzaSyAtUpRosHz_Bd7OFDThWLwfx4xohyk8oUM',
  authDomain: 'testing-push-6bfd8.firebaseapp.com',
  projectId: 'testing-push-6bfd8',
  storageBucket: 'testing-push-6bfd8.appspot.com',
  messagingSenderId: '823246048795',
  appId: '1:823246048795:web:b0aadd98ea28776393b2be'
}

firebase.initializeApp(firebaseConfig)

// Retrieve firebase messaging
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
