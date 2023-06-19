import { ReactNode } from 'react'

export function TableRow({
  italic,
  onClick,
  id,
  children,
}: {
  italic: boolean
  onClick: (key: string) => void
  id: string
  children: ReactNode
}) {
  return (
    <tr
      tabIndex={0}
      onKeyDown={({ code, currentTarget }) => {
        if (['Enter', 'Space'].includes(code)) {
          onClick(id)
        }
        if (code === 'ArrowUp' && currentTarget.previousElementSibling) {
          ;(currentTarget.previousElementSibling as HTMLElement).focus()
        }
        if (code === 'ArrowDown' && currentTarget.nextElementSibling) {
          ;(currentTarget.nextElementSibling as HTMLElement).focus()
        }
      }}
      onClick={() => onClick(id)}
      key={id}
      className={`hover:scale-100 hover:cursor-pointer hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] ${italic ? 'italic' : ''} print:hidden`}
    >
      {children}
    </tr>
  )
}
