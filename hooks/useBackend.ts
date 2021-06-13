import { useContext } from 'react'
import { BEContext } from '@lib/context/BEContext'

export const useBackend = () => useContext(BEContext)
