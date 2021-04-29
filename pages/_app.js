import 'tailwindcss/tailwind.css'
import 'reactjs-popup/dist/index.css';
import '../styles/globals.css'
import { useAppHeight } from '../hooks/useAppHeight'

function MyApp({ Component, pageProps }) {
  useAppHeight()
  return <Component {...pageProps} />
}

export default MyApp
