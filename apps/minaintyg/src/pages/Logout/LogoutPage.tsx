import { useEffect } from 'react'
import { useLogout } from '../../hooks/useLogout'
import { useAppSelector } from '../../store/hooks'

export function LogoutPage() {
  const hasSessionEnded = useAppSelector((state) => state.sessionSlice.hasSessionEnded)
  const logout = useLogout()

  useEffect(() => {
    if (!hasSessionEnded) {
      logout()
    }
  }, [hasSessionEnded, logout])

  return null
}
