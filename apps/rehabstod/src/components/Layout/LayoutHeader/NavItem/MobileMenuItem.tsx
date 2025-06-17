import { IDSMobileMenuItem } from '@inera/ids-react'
import { Link } from 'react-router-dom'
import { useActivePage } from './hooks/useActivePage'

export function MobileMenuItem({ to, title, slot, active = false }: { to: string; title: string; slot: string; active?: boolean }) {
  const isActive = useActivePage(to)
  return (
    <IDSMobileMenuItem active={active || isActive} slot={slot}>
      <Link to={to}>{title}</Link>
    </IDSMobileMenuItem>
  )
}
