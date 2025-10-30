import type { ComponentProps } from 'react'
import { Checkbox } from '../Checkbox/Checkbox'

export function SelectMultipleOption({ checked, ...props }: ComponentProps<typeof Checkbox>) {
  return <Checkbox checked={checked} role="option" {...props} />
}
