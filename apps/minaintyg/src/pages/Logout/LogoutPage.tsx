import { useEffect, type ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { endSession } from '../../store/slice/session.slice'

export function LogoutPage({ children }: { children?: ReactNode }) {
  const hasSessionEnded = useAppSelector((state) => state.sessionSlice.hasSessionEnded)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(endSession({ reason: 'logged-out' }))
  }, [dispatch])

  if (hasSessionEnded) {
    return children
  }

  return null
}
