import { useLocation, useResolvedPath } from 'react-router-dom'

export function useActivePage(to: string) {
  const path = useResolvedPath(to)
  const location = useLocation()

  return (
    location.pathname === path.pathname ||
    (location.pathname.startsWith(path.pathname) && location.pathname.charAt(path.pathname.length) === '/')
  )
}
