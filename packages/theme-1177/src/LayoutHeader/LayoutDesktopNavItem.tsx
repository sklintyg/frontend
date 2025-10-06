import { useActivePage } from '@frontend/components'
import { IDSHeader1177NavItem } from '@inera/ids-react'
import { Link } from 'react-router-dom'

export function LayoutDesktopNavItem({ to, title, active = false }: { to: string; title: string; active?: boolean }) {
  const isActive = useActivePage(to)

  return (
    <IDSHeader1177NavItem active={active || isActive}>
      <Link to={to}>{title}</Link>
    </IDSHeader1177NavItem>
  )
}
