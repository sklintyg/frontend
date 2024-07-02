import { classNames } from '@frontend/components'
import { IDSIconCalendar } from '@frontend/ids-react-ts'
import { useRef } from 'react'
import type { AriaButtonProps} from 'react-aria';
import { useButton } from 'react-aria'
import { PopoverTrigger } from '../../Popover/PopoverTrigger'

export function DatePickerButton({ error, ...props }: AriaButtonProps & { error?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(props, ref)

  return (
    <PopoverTrigger ref={ref} {...buttonProps} className={classNames('px-5 py-3', error ? 'text-error-40' : 'text-accent-40')}>
      <IDSIconCalendar width="1.25em" height="1.25em" color="currentColor" color2="currentColor" />
    </PopoverTrigger>
  )
}
