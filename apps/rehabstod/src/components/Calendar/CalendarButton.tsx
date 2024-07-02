import { useRef } from 'react'
import type { AriaButtonProps} from 'react-aria';
import { useButton } from 'react-aria'

export function CalendarButton(props: AriaButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(props, ref)
  const { children } = props

  return (
    <button type="button" {...buttonProps} ref={ref} className="px-3">
      {children}
    </button>
  )
}
