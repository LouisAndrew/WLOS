import initApp, { FirebaseApp, Firestore, initFirestore } from '@lib/API/firebase'
import { getService, Service, ServiceReturnType } from '@lib/API/firestore'
import { CollectionNames } from '@t/Relations'
import { useEffect, useState } from 'react'

export type BE = {
  /**
   * Get firebase instance
   */
  firebase: () => FirebaseApp
  /**
   * Get firestore instance
   */
  firestore: () => Firestore
  /**
   * Get a service by collection name
   * @see /lib/API/firestore.ts
   */
  getService: <T extends CollectionNames>(query: T) => Service<ServiceReturnType<T>>
}

export const useProvideBE = (): BE => {
  const [app] = useState<FirebaseApp>(initApp())
  const [db] = useState<Firestore>(initFirestore())

  return {
    firebase: () => app,
    firestore: () => db,
    getService: (query) => {
      return getService(db, query)
    },
  }
}
