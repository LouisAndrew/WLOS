import React, { createContext, FC } from 'react'

import { Auth, defaultAuth, useProvideAuth, useMockAuth } from '@lib/provider/useProvideAuth'

export const AuthContext = createContext<Auth>(defaultAuth)

const AuthProvider: FC = ({ children }) => {
  const auth = useProvideAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export default AuthProvider

export const MockAuthProvider: FC = ({ children }) => {
  const auth = useMockAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
