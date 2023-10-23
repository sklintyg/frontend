import { TooltipIcon } from '@frontend/components'
import { IDSIconQuestion } from '@frontend/ids-react-ts'
import { useId } from 'react'
import { FormattedNumberInput } from '../../Form/FormattedNumberInput'
import { PrintTitle } from '../print/PrintTitle'

export function RangeFilter({
  title,
  description,
  onFromChange,
  onToChange,
  to,
  from,
  max,
  min,
}: {
  title: string
  description: string
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  to: string
  from: string
  max: string
  min: string
}) {
  const id = useId()

  return (
    <>
      <div className="print:hidden">
        <div>
          <label htmlFor={id}>{title}</label>
          <TooltipIcon description={description} icon={<IDSIconQuestion size="s" className="relative top-1 ml-2" />} />
        </div>
        <div className="flex grow gap-3">
          <FormattedNumberInput
            id={id}
            label="Från"
            onChange={(value) => onFromChange(value)}
            value={from === '0' ? '' : from}
            inline
            max={to}
            min={min}
            defaultValue={min}
          />
          <FormattedNumberInput
            label="Till"
            onChange={(value) => onToChange(value)}
            value={to === '0' ? '' : to}
            inline
            max={max}
            min={from}
            defaultValue={max}
            aria-label={id}
          />
        </div>
      </div>
      <div className="hidden print:block">
        <PrintTitle title={title} />
        {from} - {to}
      </div>
    </>
  )
}
