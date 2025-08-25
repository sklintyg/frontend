import type { ReactNode } from 'react'
import { classNames } from '../../../utils/classNames'

export function TableRow<T>({
  italic,
  onNavigate,
  data,
  focusable = false,
  children,
}: {
  italic?: boolean
  onNavigate?: (data: T) => void
  data?: T
  focusable?: boolean
  children: ReactNode
}) {
  return (
    <tr
      tabIndex={0}
      onKeyDown={({ code, currentTarget }) => {
        if (onNavigate && data && ['Enter', 'Space'].includes(code)) {
          onNavigate(data)
        }
        if (focusable && code === 'ArrowUp' && currentTarget.previousElementSibling) {
          ;(currentTarget.previousElementSibling as HTMLElement).focus()
        }
        if (focusable && code === 'ArrowDown' && currentTarget.nextElementSibling) {
          ;(currentTarget.nextElementSibling as HTMLElement).focus()
        }
      }}
      onClick={() => {
        if (onNavigate && data) {
          onNavigate(data)
        }
      }}
      className={classNames(
        'print:hidden group',
        focusable && 'hover:scale-100 hover:cursor-pointer hover:shadow-[0_0_10px_rgba(0,0,0,0.3)]',
        italic && 'italic'
      )}
    >
      {children}
    </tr>
  )
}
