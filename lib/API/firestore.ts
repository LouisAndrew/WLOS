import { Band } from '@t/Band'
import { Exercise, ExerciseDBSchema } from '@t/Exercise'
import { CollectionNames } from '@t/Relations'
import { Template } from '@t/Template'
import { UserDBSChema } from '@t/User'
import { WorkoutLog } from '@t/WorkoutLog'
import { FirebaseApp, Firestore, FirestoreCollectionRef, FirestoreError } from './firebase'
import exerciseService from './services/exercise'

export type Error = { msg: string }
export type SuccessResponse = { success: true }
export type Response<T = {}> = [T | null, Error | null]

export type Service<T> = {
  create: (data: T) => Promise<Response<SuccessResponse>>
  read: (query: string) => Promise<Response<T>>
  update: (query: string, data: Partial<T>) => Promise<Response<T>>
  delete: (query: string) => Promise<Response<SuccessResponse>>
}

export type ServiceReturnType<T> = T extends CollectionNames.USER
  ? UserDBSChema
  : T extends CollectionNames.EXERCISE
  ? ExerciseDBSchema<true>
  : T extends CollectionNames.TEMPLATE
  ? Template
  : T extends CollectionNames.WORKOUT_LOG
  ? WorkoutLog
  : T extends CollectionNames.SAVED_EXERCISES
  ? ExerciseDBSchema<true>[]
  : T extends CollectionNames.SAVED_TEMPLATES
  ? Template[]
  : T extends CollectionNames.SAVED_LOGS
  ? WorkoutLog[]
  : T extends CollectionNames.USER_BANDS
  ? Band[]
  : any

export type ServiceGetter<T> = (collectionRef: FirestoreCollectionRef) => Service<T>
// export type ServiceTree = Record<CollectionNames.EXERCISE, ServiceGetter<any>>
const serviceTree = {
  [CollectionNames.EXERCISE]: exerciseService,
}

export const handleFirestoreError = (e: any | unknown): Response<null> => [
  null,
  { msg: (e as FirestoreError).message },
]

export const handleNotExist = (): Response<null> => [null, { msg: 'Document does not exist' }]

export const initFirestore = (app: FirebaseApp) => app.firestore()
export const getService = <T extends CollectionNames>(
  firestore: Firestore,
  collectionName: T
): Service<ServiceReturnType<T>> =>
  serviceTree[collectionName as any](firestore.collection(collectionName))
