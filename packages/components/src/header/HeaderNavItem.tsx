import { IDSHeaderNavItem } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import { useActivePage } from './hooks/useActivePage'

export function HeaderNavItem({ to, title }: { to: string; title: string }) {
  const isActive = useActivePage(to)
  return (
    <IDSHeaderNavItem link active={isActive}>
      <Link to={to}>{title}</Link>
    </IDSHeaderNavItem>
  )
}
