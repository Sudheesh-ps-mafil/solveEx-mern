importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");
// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyB9W0_wxh7tUDHEvFULuxGeBErzfAPwM8w",
    authDomain: "my-web-site-385808.firebaseapp.com",
    databaseURL: "https://my-web-site-385808-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "my-web-site-385808",
    storageBucket: "my-web-site-385808.appspot.com",
    messagingSenderId: "503438361782",
    appId: "1:503438361782:web:235f222f9624d95783d217",
    measurementId: "G-0WV0EZY57Z"
  };

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});