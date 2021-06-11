import { FirebaseApp } from './firebase'

export type Error = { msg: string }
export type SuccessResponse = { success: true }
export type Response<T = {}> = [T | null, Error | null]

export type Service<T> = {
  create: (data: T) => Promise<Response<SuccessResponse>>
  read: (query: string) => Promise<Response<T>>
  update: (query: string, data: Partial<T>) => Promise<Response<T & SuccessResponse>>
  delete: (query: string) => Promise<Response<SuccessResponse>>
}

export const firestore = (app: FirebaseApp) => app.firestore()
// export const fire
