import { TooltipIcon } from '../../TooltipIcon/TooltipIcon'
import { FormattedNumberInput } from '../../Form/FormattedNumberInput'

export function TimePeriodFilter({
  title,
  description,
  onFromChange,
  onToChange,
  to,
  from,
}: {
  title: string
  description: string
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  to: string
  from: string
}) {
  const maxLimit = '365'
  const minLimit = '1'

  return (
    <>
      <div>
        <span>{title}</span>
        <TooltipIcon description={description} name="question" size="s" className="relative top-1 ml-2" />
      </div>
      <div className="flex w-72 gap-3">
        <FormattedNumberInput
          label="Från"
          onChange={(value) => onFromChange(value)}
          value={from === '0' ? '' : from}
          inline
          max={to}
          min={minLimit}
          defaultValue={minLimit}
        />
        <FormattedNumberInput
          label="Till"
          onChange={(value) => onToChange(value)}
          value={to === '0' ? '' : to}
          inline
          max={maxLimit}
          min={from}
          defaultValue={maxLimit}
        />
      </div>
    </>
  )
}
