importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-messaging-compat.js')

const firebaseConfig = {
  apiKey: 'AIzaSyAcvORxjeb9j9Mu6GMEe6NAFP2E5Lm4XhI',
  authDomain: 'cvmanager---notification.firebaseapp.com',
  projectId: 'cvmanager---notification',
  storageBucket: 'cvmanager---notification.appspot.com',
  messagingSenderId: '435313483009',
  appId: '1:435313483009:web:bf77162dc071d3aff78f00',
  measurementId: 'G-1D3MG859Y7'
}

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  const { title, body } = payload?.data
  const notificationOptions = { body }

  const channel = new BroadcastChannel('sw-messages')
  channel.postMessage(payload)

  self.registration.showNotification(title, notificationOptions)
})
