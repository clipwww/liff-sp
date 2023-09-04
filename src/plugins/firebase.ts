import firebase from 'firebase/app'
import 'firebase/database'

export const firebaseInstance = firebase.initializeApp({
  apiKey: 'AIzaSyDI578qA-BjjSFfxV07GU5V-GLbBledu_Q',
  authDomain: 'my-first-firebase-projec-30d45.firebaseapp.com',
  databaseURL: 'https://my-first-firebase-projec-30d45.firebaseio.com',
  projectId: 'my-first-firebase-projec-30d45',
  storageBucket: 'my-first-firebase-projec-30d45.appspot.com',
  messagingSenderId: '1018687191918',
  appId: '1:1018687191918:web:dccdcdc93aedda045e9f7f',
})

export const movieRef = firebaseInstance.database().ref('/movie/')

export const turnipRef = firebaseInstance.database().ref('/turnip/')
