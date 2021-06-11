import uniqid from 'uniqid'

import { CollectionNames } from '@t/Relations'
import {
  handleFirestoreError,
  handleNotExist,
  Service,
  ServiceGetter,
  ServiceReturnType,
} from '../firestore'
import { set } from 'lodash'
import { ExerciseDBSchema } from '@t/Exercise'

type ServiceType = ServiceReturnType<CollectionNames.EXERCISE>
const exerciseService: ServiceGetter<ServiceType> = (collectionRef) => ({
  async create(data) {
    try {
      const dbData = data
      while (dbData.exerciseId === '-1') {
        const id = uniqid()
        if (!(await collectionRef.doc(id).get()).exists) {
          set(dbData, 'exerciseId', id)
          break
        }
      }

      return [{ success: true }, null]
    } catch (e) {
      return handleFirestoreError(e)
    }
  },
  async read(query) {
    try {
      const request = await collectionRef.doc(query).get()
      if (request.exists) {
        const data = (await request.data()) as ExerciseDBSchema
        const userDataRequest = await data.createdBy.get()

        if (userDataRequest.exists) {
          return [{ ...data, createdBy: userDataRequest.data().uid }, null]
        }

        return [{ ...data, createdBy: 'NOT_EXISTS' }, null]
      }

      return handleNotExist()
    } catch (e) {
      return handleFirestoreError(e)
    }
  },
  async update(query, data) {
    try {
      const doc = collectionRef.doc(query)
      const request = await doc.get()
      if (request.exists) {
        await doc.update(data)
        return (this as Service<ServiceType>).read(query)
      }

      return handleNotExist()
    } catch (e) {
      return handleFirestoreError(e)
    }
  },
  async delete(query) {
    try {
      const doc = collectionRef.doc(query)
      const request = await doc.get()
      if (request.exists) {
        await doc.delete()
      }

      return handleNotExist()
    } catch (e) {
      return handleFirestoreError(e)
    }
  },
})
