import React, { createContext, FC } from 'react'
import {
  UD,
  defaultUD,
  useMockUserData,
  useProvideUserData,
} from '@lib/provider/useProvideUserData'

export const UDContext = createContext<UD>(defaultUD)

const Provider = (hook: () => UD): FC<any> => {
  return ({ children, ...rest }) => {
    const userData = hook()
    return <UDContext.Provider value={{ ...userData, ...rest }}>{children}</UDContext.Provider>
  }
}

export default Provider(useProvideUserData)
export const MockUserDataProvider = Provider(useMockUserData)
