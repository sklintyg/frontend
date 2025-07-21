import { useId } from 'react'
import { FormattedNumberInput } from '../../form/FormattedNumberInput'
import { InputLabel } from '../../form/InputLabel/InputLabel'
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
        <InputLabel htmlFor={id} description={description}>
          {title}
        </InputLabel>
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
