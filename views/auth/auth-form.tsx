import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { useAuth } from '@h/useAuth'
import classname from 'classnames/bind'

import styles from './auth-form.module.css'

const cx = classname.bind(styles)

export type Props = {}

type AuthState = 'SIGN_IN' | 'SIGN_UP'

const texts: Record<AuthState, { btnText: string; headingText: string }> = {
  SIGN_IN: {
    headingText: 'If you are new',
    btnText: 'Create New Account',
  },
  SIGN_UP: {
    headingText: 'Already have an account?',
    btnText: 'Sign in',
  },
}

const AuthForm: FC<Props> = () => {
  const router = useRouter()
  const { signIn, signInWithGoogle, signUp } = useAuth()
  const [authState, setAuthState] = useState<AuthState>('SIGN_IN')
  const [formState, setFormState] = useState<{ username: string; password: string }>({
    username: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const headingText = authState === 'SIGN_IN' ? 'Login Now.' : 'Create an account'

  useEffect(() => {
    const path = router.asPath.replace('/auth?', '')

    if (path === 'sign-up') {
      setAuthState('SIGN_UP')
      return
    }
    setAuthState('SIGN_IN')
  }, [])

  useEffect(() => {
    router.replace(`auth?${authState.toLowerCase().split('_').join('-')}`, undefined, {
      shallow: true,
    })
  }, [authState])

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

  const passwordToggleClass = cx({
    'password-toggle': true,
    show: formState.password,
  })

  return (
    <div data-testid="auth-form-wrapper" className={styles.wrapper}>
      <h1>
        Hey,
        <span className="text-primary-yellow block">{headingText}</span>
      </h1>
      <div className={styles.breadcrumb}>
        {texts[authState].headingText} /
        <button
          className="btn btn--secondary btn--text inline-block"
          onClick={() => setAuthState(authState === 'SIGN_IN' ? 'SIGN_UP' : 'SIGN_IN')}
        >
          {texts[authState].btnText}
        </button>
      </div>
      <form onSubmit={handleSubmit} role="form" className="py-3 duration-200">
        <label htmlFor="username">
          Username
          <input
            type="text"
            id="username"
            className="input input--primary"
            placeholder="Username"
            value={formState.username}
            onChange={(e) => setFormState((prev) => ({ ...prev, username: e.target.value }))}
          />
        </label>
        <label htmlFor="password" className="block mt-6 relative">
          Password
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            className="input input--secondary pr-20"
            placeholder="Password"
            value={formState.password}
            onChange={(e) => setFormState((prev) => ({ ...prev, password: e.target.value }))}
          />
          <span onClick={() => setShowPassword((prev) => !prev)} className={passwordToggleClass}>
            {showPassword ? 'HIDE' : 'SHOW'}
          </span>
        </label>
        {authState === 'SIGN_IN' ? (
          <>
            <button
              data-testid="sign-in"
              type="submit"
              className={`btn btn--primary mb-3 mt-12 ${styles.button}`}
            >
              Sign In
            </button>
            <button
              data-testid="sign-in-google"
              className={`btn btn--secondary ${styles.button}`}
              onClick={handleClickSignInGoogle}
            >
              Sign In with Google
            </button>
          </>
        ) : (
          <button
            data-testid="sign-up"
            type="submit"
            className={`btn btn--primary mb-3 mt-12 ${styles.button}`}
          >
            Sign Up
          </button>
        )}
      </form>
    </div>
  )
}

export default AuthForm
