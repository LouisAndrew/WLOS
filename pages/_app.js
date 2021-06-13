import 'tailwindcss/tailwind.css'
import 'reactjs-popup/dist/index.css';
import BEProvider from '../lib/context/BEContext'
import '../styles/globals.css'
import { useAppHeight } from '../hooks/useAppHeight'

function MyApp({ Component, pageProps }) {
  useAppHeight()
  return <BEProvider>
    <Component {...pageProps} />
  </BEProvider>
}

export default MyApp
