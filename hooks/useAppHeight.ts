import { useEffect } from 'react'

export const useAppHeight = () => {
  const setAppHeight = () =>
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)

  useEffect(() => {
    setAppHeight()
    document.addEventListener('resize', setAppHeight)
    return () => {
      document.removeEventListener('resize', setAppHeight)
    }
  }, [])
}
