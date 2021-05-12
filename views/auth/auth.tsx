import React, { FC, useState } from 'react'

import classname from 'classnames/bind'

import styles from './auth.module.css'
import AuthImage from './auth-img'
import AuthForm from './auth-form'

const cx = classname.bind(styles)

export type Props = {}

const Auth: FC<Props> = () => {
  const [displayAuthImage, setDisplayAuthImage] = useState(true)

  const quote = 'Millions of people use this app to make their life better'

  const authFormWrapperClass = cx({
    'auth-form__wrapper': true,
    'display-form': !displayAuthImage,
  })

  return (
    <div data-testid="auth-wrapper" className={`h-full-screen ${styles.wrapper}`}>
      <div className={styles['auth-image__wrapper']}>
        <AuthImage />
        <h5>Get Started</h5>
        <h3 className={styles['auth-image__heading']}>{quote}</h3>
        <button
          className={`btn btn--primary ${styles['auth-image__next-btn']}`}
          onClick={() => setDisplayAuthImage(false)}
        >
          Next
        </button>
      </div>
      <div className={authFormWrapperClass}>
        <AuthForm />
      </div>
    </div>
  )
}

export default Auth
