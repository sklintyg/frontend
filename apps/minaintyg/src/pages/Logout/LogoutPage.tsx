import type { ReactNode } from 'react'
import { useAppSelector } from '../../store/hooks'

export function LogoutPage({ children }: { children?: ReactNode }) {
  const hasSessionEnded = useAppSelector((state) => state.sessionSlice.hasSessionEnded)

  if (hasSessionEnded) {
    return children
  }

  return null
}
