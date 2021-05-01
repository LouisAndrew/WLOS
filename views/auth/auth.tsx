import React, { FC } from 'react'
import styles from './auth.module.css'
import AuthImage from './auth-img'
import AuthForm from './auth-form'

export type Props = {}

const Auth: FC<Props> = () => {
  const quote = 'Millions of people use this app to make their life better'

  return (
    <div data-testid="auth-wrapper" className={`h-full-screen ${styles.wrapper}`}>
      <div className={styles['auth-image__wrapper']}>
        <AuthImage />
        <h5>Get Started</h5>
        <h3 className={styles['auth-image__heading']}>{quote}</h3>
        <button className={`btn btn--primary ${styles['auth-image__next-btn']}`}>Next</button>
      </div>
      <AuthForm />
    </div>
  )
}

export default Auth
