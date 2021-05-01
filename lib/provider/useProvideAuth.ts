export type Auth = {
  user: () => void
  signIn: (username: string, password: string) => Promise<boolean>
  signInWithGoogle: () => Promise<boolean>
  signUp: (username: string, password: string) => Promise<boolean>
}

export const defaultAuth: Auth = {
  user: () => {},
  signIn: async () => true,
  signInWithGoogle: async () => true,
  signUp: async () => true,
}

export const useProvideAuth = () => defaultAuth
export const useMockAuth = () => defaultAuth
