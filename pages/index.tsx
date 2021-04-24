import Head from 'next/head'

import { Layout } from '@c/layout'

import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Hello, world!</title>
      </Head>
      <Layout>Hello, world!</Layout>
    </div>
  )
}
