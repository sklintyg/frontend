import { IDSIconCalendar } from '@frontend/ids-react-ts'
import { useRef } from 'react'
import { AriaButtonProps, useButton } from 'react-aria'
import { PopoverTrigger } from '../../Popover/PopoverTrigger'

export function DatePickerButton(props: AriaButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(props, ref)

  return (
    <PopoverTrigger ref={ref} {...buttonProps} className="py-3 px-5">
      <IDSIconCalendar width="1.25em" height="1.25em" />
    </PopoverTrigger>
  )
}
