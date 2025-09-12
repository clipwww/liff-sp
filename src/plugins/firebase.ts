import { initializeApp } from 'firebase/app'
import { getDatabase, ref } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyDI578qA-BjjSFfxV07GU5V-GLbBledu_Q',
  authDomain: 'my-first-firebase-projec-30d45.firebaseapp.com',
  databaseURL: 'https://my-first-firebase-projec-30d45.firebaseio.com',
  projectId: 'my-first-firebase-projec-30d45',
  storageBucket: 'my-first-firebase-projec-30d45.appspot.com',
  messagingSenderId: '1018687191918',
  appId: '1:1018687191918:web:dccdcdc93aedda045e9f7f',
}

export const firebaseInstance = initializeApp(firebaseConfig)

const database = getDatabase(firebaseInstance)

export const movieRef = ref(database, '/movie/')

export const turnipRef = ref(database, '/turnip/')
