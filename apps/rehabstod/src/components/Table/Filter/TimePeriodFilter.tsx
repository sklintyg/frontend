import { NumberInput } from '../../Form/NumberInput'
import { TooltipIcon } from '../../TooltipIcon/TooltipIcon'

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
  onFromChange: (value: number) => void
  onToChange: (value: number) => void
  to: number
  from: number
}) {
  const maxLimit = 365
  const minLimit = 1

  const convertTimePeriodValue = (value: string, min: number, max: number) => {
    if (Number(value) < min) {
      return min
    }

    if (Number(value) > max) {
      return max
    }

    return Number(value)
  }

  return (
    <>
      <div>
        <span className="mr-2">{title}</span>
        <TooltipIcon description={description} name="question" size="s" />
      </div>
      <div className="flex gap-3">
        <NumberInput
          id="timePeriodFromFilter"
          label="Från"
          onChange={(event) => onFromChange(convertTimePeriodValue(event.currentTarget.value, minLimit, to))}
          value={from}
          isRange
          max={to}
          min={minLimit}
        />
        <NumberInput
          id="timePeriodToFilter"
          label="Till"
          onChange={(event) => onToChange(convertTimePeriodValue(event.currentTarget.value, from, maxLimit))}
          value={to}
          isRange
          max={maxLimit}
          min={from}
        />
      </div>
    </>
  )
}
