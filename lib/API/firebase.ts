// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from 'firebase/app'
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
// import 'firebase/analytics'

// Add the Firebase products that you want to use
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  // ...
}

// Initialize Firebase
const initApp = () => firebase.initializeApp(firebaseConfig)
export default initApp

export type DocumentReference<
  T = firebase.firestore.DocumentData
> = firebase.firestore.DocumentReference<T>

export type FirestoreTimestamp = firebase.firestore.Timestamp
export type FirestoreConverter<T> = firebase.firestore.FirestoreDataConverter<T>

export const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: firebase.firestore.QueryDocumentSnapshot) => snap.data() as T,
})
