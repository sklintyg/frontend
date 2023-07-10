import { IDSHeaderNavItem } from '@frontend/ids-react-ts'
import { Link, useLocation, useResolvedPath } from 'react-router-dom'

export function LayoutHeaderTab({ to, title }: { to: string; title: string }) {
  const path = useResolvedPath(to)
  const location = useLocation()

  const isActive =
    location.pathname === path.pathname ||
    (location.pathname.startsWith(path.pathname) && location.pathname.charAt(path.pathname.length) === '/')

  return (
    <IDSHeaderNavItem link active={isActive}>
      <Link to={to}>{title}</Link>
    </IDSHeaderNavItem>
  )
}
