import { IDSCheckboxGroup, IDSSelectMultiple } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'
import { TooltipIcon } from '../TooltipIcon/TooltipIcon'

export function SelectMultiple({
  label,
  description,
  options,
  id,
  placeholder,
}: {
  label: string
  description: string
  options: ReactNode
  id: string
  placeholder: string
}) {
  return (
    <>
      <label htmlFor={id}>
        {label} {description && <TooltipIcon description={description} name="question" size="s" />}
      </label>
      <IDSSelectMultiple placeholder={placeholder}>
        <IDSCheckboxGroup compact>{options}</IDSCheckboxGroup>
      </IDSSelectMultiple>
    </>
  )
}
