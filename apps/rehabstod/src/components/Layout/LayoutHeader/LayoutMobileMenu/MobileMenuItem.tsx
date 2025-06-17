import { Link } from 'react-router-dom'
import { classNames } from '../../../../utils/classNames'
import { useActivePage } from '../hooks/useActivePage'

export function MobileMenuItem({ to, title, active }: { to: string; title: string; active?: boolean }) {
  const isActive = useActivePage(to)
  return (
    <li className={classNames('ids-mobile-menu-item', (active || isActive) && 'ids-mobile-menu-item--active')}>
      <Link className="ids-mobile-menu-item__inner" to={to}>
        {title}
      </Link>
    </li>
  )
}
