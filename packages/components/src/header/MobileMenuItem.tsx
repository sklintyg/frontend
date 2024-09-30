import { IDSMobileMenuItem } from 'ids-react-ts'
import { Link } from 'react-router-dom'
import { useActivePage } from './hooks/useActivePage'

export function MobileMenuItem({ to, title, active = false }: { to: string; title: string; active?: boolean }) {
  const isActive = useActivePage(to)
  return (
    <IDSMobileMenuItem active={active || isActive}>
      <Link to={to}>{title}</Link>
    </IDSMobileMenuItem>
  )
}
