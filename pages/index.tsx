import Head from 'next/head'
import { Button } from 'antd'

import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Hello, world!</title>
      </Head>
      <Button>Click me!</Button>
    </div>
  )
}
