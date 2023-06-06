importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-messaging-compat.js')
import firebaseConfig from 'firebaseConfig.json'

const firebaseConfig = firebaseConfig

firebase.initializeApp(firebaseConfig)

// Retrieve firebase messaging
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  console.log('Notification Data From Firebase On Background: ', payload)
  const { title, body } = payload?.data
  const notificationOptions = { body }

  self.registration.showNotification(title, notificationOptions)
})
