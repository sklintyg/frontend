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
  if (!options || (options instanceof Array && options.length === 0)) {
    return null
  }

  return (
    <>
      <label htmlFor={id}>{label}</label>
      {description && <TooltipIcon description={description} name="question" size="s" className="relative top-1 ml-2" />}
      <IDSSelectMultiple placeholder={placeholder} className="text-sm">
        <IDSCheckboxGroup compact>{options}</IDSCheckboxGroup>
      </IDSSelectMultiple>
    </>
  )
}
