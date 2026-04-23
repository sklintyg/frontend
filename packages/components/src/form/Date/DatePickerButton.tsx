import { useRef } from 'react'
import type { AriaButtonProps } from 'react-aria'
import { useButton } from 'react-aria'
import { Icon } from '../../Icon/Icon'
import { PopoverTrigger } from '../../Popover/PopoverTrigger'
import { classNames } from '../../utils/classNames'

export function DatePickerButton({ error, iconColorPreset, ...props }: AriaButtonProps & { error?: boolean; iconColorPreset?: 1 | 2 | 3 | 4 }) {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(props, ref)

  let colorClass: string | undefined = 'text-accent-40'
  if (error) colorClass = 'text-error-40'
  else if (iconColorPreset) colorClass = undefined

  return (
    <PopoverTrigger ref={ref} {...buttonProps} className={classNames('pl-3 py-1.5', colorClass)}>
      <Icon
        icon="calendar"
        colorPreset={iconColorPreset}
        style={iconColorPreset ? { color: `var(--IDS-ICON__COLOR-PRESET-${iconColorPreset})` } : undefined}
      />
    </PopoverTrigger>
  )
}
