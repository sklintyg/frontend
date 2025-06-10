import { IDSHeader1177AdminNavItem } from '@inera/ids-react'
import { Link } from 'react-router-dom'
import { useActivePage } from './hooks/useActivePage'

export function HeaderNavItem({ to, title, active = false }: { to: string; title: string; active?: boolean }) {
  const isActive = useActivePage(to)

  return (
    <IDSHeader1177AdminNavItem active={active || isActive}>
      <Link to={to}>{title}</Link>
    </IDSHeader1177AdminNavItem>
  )
}
