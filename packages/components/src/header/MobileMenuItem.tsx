import { IDSMobileMenuItem } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import { useActivePage } from './hooks/useActivePage'

export function MobileMenuItem({ to, title }: { to: string; title: string }) {
  const isActive = useActivePage(to)
  return (
    <IDSMobileMenuItem active={isActive}>
      <Link to={to}>{title}</Link>
    </IDSMobileMenuItem>
  )
}
