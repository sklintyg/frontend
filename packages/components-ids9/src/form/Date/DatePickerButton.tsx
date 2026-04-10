import { useRef } from 'react'
import type { AriaButtonProps } from 'react-aria'
import { useButton } from 'react-aria'
import { Icon } from '../../Icon/Icon'
import { PopoverTrigger } from '../../Popover/PopoverTrigger'
import { classNames } from '../../utils/classNames'

export function DatePickerButton({ error, ...props }: AriaButtonProps & { error?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(props, ref)

  return (
    <PopoverTrigger ref={ref} {...buttonProps} className={classNames('pl-3 py-1.5', error ? 'text-error-40' : 'text-accent-40')}>
      <Icon icon="calendar" />
    </PopoverTrigger>
  )
}
