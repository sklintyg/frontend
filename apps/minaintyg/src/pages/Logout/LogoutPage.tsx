import { useEffect } from 'react'
import { useLogout } from '../../hooks/useLogout'

export function LogoutPage() {
  const logout = useLogout()

  useEffect(() => {
    logout()
  }, [logout])

  return null
}
