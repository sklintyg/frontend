import { IDSIconQuestion, IDSSelect } from '@frontend/ids-react-ts'
import React, { useId, useState } from 'react'
import { Select } from '../../Form/Select'
import { TooltipIcon } from '../../TooltipIcon/TooltipIcon'
import { PrintTitle } from '../print/PrintTitle'

export function SelectFilter({
  onChange,
  options,
  description,
  value,
  label,
  hideDefaultValue = false,
}: {
  onChange: (option: string) => void
  options: { id: string; name: string }[]
  description: string
  value?: string
  label: string
  hideDefaultValue?: boolean
}) {
  const id = useId()
  const [open, setOpen] = useState(false)

  const chosenOption = options ? options.find((option) => option.id === value) : undefined

  return (
    <>
      <div className="flex-1 print:hidden">
        <label htmlFor={id}>
          {label}
          {description && <TooltipIcon description={description} icon={<IDSIconQuestion size="s" className="relative top-1 ml-2" />} />}
        </label>
        <IDSSelect className="m-0">
          <div className="relative">
            <Select onClick={() => setOpen(!open)} value={value} id={id} onChange={(event) => onChange(event.currentTarget.value)}>
              {!hideDefaultValue && (
                <option className="ml-2" id="" value="">
                  Visa alla{' '}
                </option>
              )}
              {options ? options.map((option) => <option value={option.id} key={option.id} label={option.name} />) : null}
            </Select>
          </div>
        </IDSSelect>
      </div>

      <div className="hidden print:block">
        <PrintTitle title={label} />
        {chosenOption ? chosenOption.name : '-'}
      </div>
    </>
  )
}
