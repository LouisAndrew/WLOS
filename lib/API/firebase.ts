import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

export type DocumentReference<
  T = firebase.firestore.DocumentData
> = firebase.firestore.DocumentReference<T>

export type FirestoreTimestamp = firebase.firestore.Timestamp
export type FirestoreConverter<T> = firebase.firestore.FirestoreDataConverter<T>

export type FirestoreDocumentData = firebase.firestore.DocumentData
export type FirestoreQueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot
export type FirestoreCollectionRef<
  T = FirestoreDocumentData
> = firebase.firestore.CollectionReference<T>
export type FirestoreError = firebase.firestore.FirestoreError

export type FirebaseApp = firebase.app.App
export type Firestore = firebase.firestore.Firestore

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  // measurementId: process.env.MEASUREMENT_ID,
}

// Initialize Firebase
const initApp = () => {
  try {
    return firebase.app()
  } catch (e) {
    return firebase.initializeApp(firebaseConfig)
  }
}

export const initFirestore = () => firebase.firestore()

export default initApp

export const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: firebase.firestore.QueryDocumentSnapshot) => snap.data() as T,
})
