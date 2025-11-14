import { classNames } from '@frontend/components'
import { Link } from 'react-router-dom'
import { useActivePage } from '../hooks/useActivePage'

export function HeaderNavItem({ to, title, active = false }: { to: string; title: string; active?: boolean }) {
  const isActive = useActivePage(to)

  return (
    <li className="ids-header-1177-admin__nav-item">
      <Link to={to} className={classNames((active || isActive) && 'after:w-auto after:right-0')}>
        {title}
      </Link>
    </li>
  )
}
