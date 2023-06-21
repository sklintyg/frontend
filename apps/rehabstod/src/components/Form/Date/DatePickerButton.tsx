import { IDSIconCalendar } from '@frontend/ids-react-ts'
import { useRef } from 'react'
import { AriaButtonProps, useButton } from 'react-aria'

export function DatePickerButton(props: AriaButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(props, ref)

  return (
    <button type="button" {...buttonProps} ref={ref} className="h-full w-full py-3 px-5">
      <IDSIconCalendar width="1.25em" height="1.25em" />
    </button>
  )
}
