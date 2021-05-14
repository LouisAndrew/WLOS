import { useContext } from 'react'
import { UDContext } from '@lib/context/UserDataContext'

export const useUserData = () => useContext(UDContext)
