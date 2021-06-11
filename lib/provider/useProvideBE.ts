import { FirebaseApp, Firestore } from '@lib/API/firebase'

export type BE = {
  firebase: () => FirebaseApp
  firestore: () => Firestore
  // services:
}
