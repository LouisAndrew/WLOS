import React, { createContext, FC } from 'react'

import { BE, useProvideBE } from '@lib/provider/useProvideBE'

export const BEContext = createContext<BE>({
  firebase: () => null,
  firestore: () => null,
  getService: () => null,
})

const Provider: FC = ({ children }) => {
  const value = useProvideBE()
  return <BEContext.Provider value={value}>{children}</BEContext.Provider>
}

export default Provider
