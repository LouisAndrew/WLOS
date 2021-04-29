import React, { FC } from 'react'
import Image from 'next/image'

const imgSrc = '/auth-athlete-img.png'
import styles from './auth-img.module.css'

export type Props = {}

const AuthImage: FC<Props> = () => {
  return (
    <div data-testid="wrapper" className={styles.wrapper}>
      <div className={styles['background-wrapper']}>
        <div className={styles['yellow-stripe']} />
        <div className={styles['white-stripe']} />
      </div>
      <div className={styles['img-wrapper']}>
        <Image src={imgSrc} width={805} height={1468} layout="responsive" />
      </div>
    </div>
  )
}

export default AuthImage
