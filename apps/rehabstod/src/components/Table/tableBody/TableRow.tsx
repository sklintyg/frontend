import { ReactNode } from 'react'

export function TableRow({
  italic,
  onNavigate,
  id,
  focusable,
  children,
}: {
  italic: boolean
  onNavigate?: (key: string) => void
  id: string
  focusable: boolean
  children: ReactNode
}) {
  return (
    <tr
      tabIndex={0}
      onKeyDown={({ code, currentTarget }) => {
        if (onNavigate && ['Enter', 'Space'].includes(code)) {
          onNavigate(id)
        }
        if (focusable && code === 'ArrowUp' && currentTarget.previousElementSibling) {
          ;(currentTarget.previousElementSibling as HTMLElement).focus()
        }
        if (focusable && code === 'ArrowDown' && currentTarget.nextElementSibling) {
          ;(currentTarget.nextElementSibling as HTMLElement).focus()
        }
      }}
      onClick={() => {
        if (onNavigate) {
          onNavigate(id)
        }
      }}
      key={`${id}-row`}
      className={`hover:scale-100 hover:cursor-pointer hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] ${italic ? 'italic' : ''} print:hidden`}
    >
      {children}
    </tr>
  )
}
