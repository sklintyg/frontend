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
  const handleOnKeyDown = (event: KeyboardEvent) => {
    if (['Enter', 'Space'].includes(event.code)) {
      onClick(id)
    }
    if (event.code === 'ArrowUp' && event.currentTarget.previousElementSibling) {
      ;(event.currentTarget.previousElementSibling as HTMLElement).focus()
    }
    if (event.code === 'ArrowDown' && event.currentTarget.nextElementSibling) {
      ;(event.currentTarget.nextElementSibling as HTMLElement).focus()
    }
  }

  return (
    <tr
      tabIndex={0}
      onKeyDown={(event) => handleOnKeyDown(event)}
      onClick={() => onClick(id)}
      key={id}
      className={`hover:scale-100 hover:cursor-pointer hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] ${italic ? 'italic' : ''} print:hidden`}
    >
      {children}
    </tr>
  )
}
