import { IDSIconCalendar } from '@inera/ids-react'
import { useRef } from 'react'
import type { AriaButtonProps } from 'react-aria'
import { useButton } from 'react-aria'
import { classNames } from '../../../utils/classNames'
import { PopoverTrigger } from '../../Popover/PopoverTrigger'

export function DatePickerButton({ error, ...props }: AriaButtonProps & { error?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(props, ref)

  return (
    <PopoverTrigger ref={ref} {...buttonProps} className={classNames('pl-3 py-1.5', error ? 'text-error-40' : 'text-accent-40')}>
      <IDSIconCalendar width="1.25em" height="1.25em" color="currentColor" color2="currentColor" />
    </PopoverTrigger>
  )
}
