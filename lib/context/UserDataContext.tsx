import React, { createContext, FC } from 'react'
import {
  UD,
  defaultUD,
  useMockUserData,
  useProvideUserData,
} from '@lib/provider/useProvideUserData'

const UDContext = createContext<UD>(defaultUD)

const Provider = (hook: () => UD): FC => {
  return ({ children }) => {
    const userData = hook()
    return <UDContext.Provider value={userData}>{children}</UDContext.Provider>
  }
}

export default Provider(useProvideUserData)
export const MockAuthProvider = Provider(useMockUserData)
