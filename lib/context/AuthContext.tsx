import React, { createContext, FC } from 'react'

import { Auth, defaultAuth, useProvideAuth, useMockAuth } from '@lib/provider/useProvideAuth'

export const AuthContext = createContext<Auth>(defaultAuth)
const Provider = (hook: () => Auth): FC => {
  return ({ children }) => {
    const userData = hook()
    return <AuthContext.Provider value={userData}>{children}</AuthContext.Provider>
  }
}

export default Provider(useProvideAuth)

export const MockAuthProvider = Provider(useMockAuth)
