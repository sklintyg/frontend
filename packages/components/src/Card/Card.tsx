import '@inera/ids-design/components/card/card.css'
import { type ReactNode } from 'react'
import { useTheme } from '../theme/useTheme'
import { classNames } from '../utils'

export function Card({
  hideons = false,
  hideonm = false,
  border = 0,
  fill = 0,
  lean = false,
  interactive = false,
  children,
}: {
  hideons?: boolean
  hideonm?: boolean
  border?: 0 | 1 | 2
  fill?: 0 | 1 | 2
  lean?: boolean
  interactive?: boolean
  children: ReactNode
}) {
  const theme = useTheme()

  return (
    <div
      className={classNames(
        'ids-card',
        fill > 0 && `ids-card--fill-${fill}`,
        lean && 'ids-card--lean',
        interactive && 'ids-card--interactive',
        hideons && 'ids-card--hide-on-s',
        hideonm && 'ids-card--hide-on-m',
        theme === 'inera-admin' && 'border-none'
      )}
    >
      {border > 0 && fill === 0 && <div className={`ids-card__border--${border}`} />}
      {children}
    </div>
  )
}
