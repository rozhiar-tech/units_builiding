// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyBCLj621A1ySfMvp3HIQtu5XpPKJHk4Mqs',
    authDomain: 'dania-city.firebaseapp.com',
    projectId: 'dania-city',
    storageBucket: 'dania-city.appspot.com',
    messagingSenderId: '176938807921',
    appId: '1:176938807921:web:e4b09d8df12e5bff85a1d0',
    measurementId: 'G-82CZR1TGL2'
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const firestore = getFirestore(app)

export { auth, onAuthStateChanged, createUserWithEmailAndPassword, firestore, collection, addDoc, getDocs }
