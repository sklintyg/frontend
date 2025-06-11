import { IDSSelectMultiple } from '@inera/ids-react'
import type { ReactNode } from 'react'
import { hasNoChildren } from '../../../utils/hasNoChildren'
import { FormTooltip } from '../FormTooltip'

export function SelectMultiple({
  children,
  description,
  label,
  placeholder,
}: {
  children: ReactNode
  description: string
  label: string
  placeholder: string
}) {
  if (hasNoChildren(children)) {
    return null
  }

  return (
    <IDSSelectMultiple labeltext={label} maxheight="" multiselectedlabel="valda" placeholder={placeholder} selectedlabel={placeholder}>
      {description && <FormTooltip>{description}</FormTooltip>}
      {children}
    </IDSSelectMultiple>
  )
}
