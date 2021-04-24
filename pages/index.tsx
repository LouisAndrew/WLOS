import Head from 'next/head'

import { Layout } from '@c/layout'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Hello, world!</title>
      </Head>
      <Layout>Hello, world!</Layout>
    </div>
  )
}
