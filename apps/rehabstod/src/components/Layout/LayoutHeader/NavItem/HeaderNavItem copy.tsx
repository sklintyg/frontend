import { useActivePage } from './hooks/useActivePage'

export function HeaderNavItem({ to, title, active = false }: { to: string; title: string; active?: boolean }) {
  const isActive = useActivePage(to)

  return null
  // return (
  //   <IDSHeaderNavItem link active={active || isActive}>
  //     <Link to={to}>{title}</Link>
  //   </IDSHeaderNavItem>
  // )
}
