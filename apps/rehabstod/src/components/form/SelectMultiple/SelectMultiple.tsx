import { IDSSelectMultiple } from '@inera/ids-react'
import { type ComponentProps } from 'react'
import { hasNoChildren } from '../../../utils/hasNoChildren'
import { FormTooltip } from '../FormTooltip'

export function SelectMultiple({
  children,
  description,
  placeholder,
  ...props
}: ComponentProps<typeof IDSSelectMultiple> & { description?: string }) {
  if (hasNoChildren(children)) {
    return null
  }

  return (
    <IDSSelectMultiple maxheight="" multiselectedlabel="valda" placeholder={placeholder} selectedlabel={placeholder} {...props}>
      {description && <FormTooltip>{description}</FormTooltip>}
      {children}
    </IDSSelectMultiple>
  )
}
