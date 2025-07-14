import { IDSIconInformation } from '@inera/ids-react'
import { useId } from 'react'
import { FormattedNumberInput } from '../../form/FormattedNumberInput'
import { TooltipIcon } from '../../Tooltip'
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
        <div className="mb-[5px]">
          <label htmlFor={id}>{title}</label>
          <TooltipIcon description={description} icon={<IDSIconInformation size="s" className="relative top-1 ml-2" />} />
        </div>
        <div className="flex grow gap-3">
          <FormattedNumberInput
            light
            id={id}
            label="Från"
            onChange={(value) => onFromChange(value)}
            value={from === '0' ? '' : from}
            max={to}
            min={min}
            defaultValue={min}
            aria-label={`${title} från`}
            aria-labelledby=""
            inline
          />
          <FormattedNumberInput
            light
            label="Till"
            onChange={(value) => onToChange(value)}
            value={to === '0' ? '' : to}
            max={max}
            min={from}
            defaultValue={max}
            aria-label={`${title} till`}
            aria-labelledby=""
            inline
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
