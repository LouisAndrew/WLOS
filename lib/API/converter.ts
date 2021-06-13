import { Exercise, ExerciseDBSchema } from '@t/Exercise'
import {
  FirestoreConverter,
  FirestoreDocumentData,
  FirestoreQueryDocumentSnapshot,
} from './firebase'

/**
 *
 *  toFirestore: (data: T) => data,
 *  fromFirestore: (snap: firebase.firestore.QueryDocumentSnapshot) => snap.data() as T,
 */
export const exerciseConverter: FirestoreConverter<Exercise> = {
  toFirestore: (data: Exercise) => data as FirestoreDocumentData,
  fromFirestore: (snap: FirestoreQueryDocumentSnapshot) => snap.data() as Exercise,
}

export default {}
