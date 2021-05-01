import { Auth } from '@lib/provider/useProvideAuth'

const useAuth = jest.spyOn(require('@h/useAuth'), 'useAuth')

type OptionalAuth = { [P in keyof Auth]?: Auth[P] }

export const mockUseAuth = ({
  user = () => {},
  signIn = async () => true,
  signInWithGoogle = async () => true,
  signUp = async () => true,
}: OptionalAuth) => {
  useAuth.mockImplementationOnce(() => ({
    user,
    signIn,
    signInWithGoogle,
    signUp,
  }))
}
