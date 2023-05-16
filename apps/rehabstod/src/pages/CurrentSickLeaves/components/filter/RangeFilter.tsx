import { FormattedNumberInput } from '../../../../components/Form/FormattedNumberInput'
import { TooltipIcon } from '../../../../components/TooltipIcon/TooltipIcon'

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
  return (
    <div>
      <div>
        <span>{title}</span>
        <TooltipIcon description={description} name="question" size="s" className="relative top-1 ml-2" />
      </div>
      <div className="flex grow gap-3">
        <FormattedNumberInput
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
        />
      </div>
    </div>
  )
}
