import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { useAuth } from '@h/useAuth'

export type Props = {}

const isSigningIn = (query: object) => query['sign-in'] !== undefined

const AuthForm: FC<Props> = () => {
  const router = useRouter()
  const { signIn, signInWithGoogle, signUp } = useAuth()
  const [authState, setAuthState] = useState<'SIGN_IN' | 'SIGN_UP'>()
  const [formState, setFormState] = useState<{ username: string; password: string }>({
    username: '',
    password: '',
  })

  const headingText = authState === 'SIGN_IN' ? 'Login Now.' : 'Create an account'

  useEffect(() => {
    setAuthState(isSigningIn(router.query) ? 'SIGN_IN' : 'SIGN_UP')
  }, [router])

  const handleClickSignInGoogle = async () => {
    await signInWithGoogle()
  }
  // todo: on success state
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { username, password } = formState
    if (username && password) {
      if (authState === 'SIGN_IN') {
        await signIn(username, password)
      } else {
        await signUp(username, password)
      }
    }
  }

  return (
    <div data-testid="auth-form-wrapper">
      <h1>
        Hey,
        <span className="text-primary-yellow">{headingText}</span>
      </h1>
      <form onSubmit={handleSubmit} role="form">
        <label htmlFor="username">
          Username
          <input
            type="text"
            id="username"
            value={formState.username}
            onChange={(e) => setFormState((prev) => ({ ...prev, username: e.target.value }))}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="text"
            id="password"
            value={formState.password}
            onChange={(e) => setFormState((prev) => ({ ...prev, password: e.target.value }))}
          />
        </label>
        {authState === 'SIGN_IN' ? (
          <>
            <button data-testid="sign-in" type="submit"></button>
            <button data-testid="sign-in-google" onClick={handleClickSignInGoogle}></button>
          </>
        ) : (
          <button data-testid="sign-up" type="submit"></button>
        )}
      </form>
    </div>
  )
}

export default AuthForm
