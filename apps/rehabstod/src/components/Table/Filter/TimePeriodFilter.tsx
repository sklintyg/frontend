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
        <span>{title}</span>
        <TooltipIcon description={description} name="question" size="s" className="relative top-1 ml-2" />
      </div>
      <div className="flex w-72 gap-3">
        <NumberInput
          label="Från"
          onChange={(event) => onFromChange(convertTimePeriodValue(event.currentTarget.value, minLimit, to))}
          value={from}
          max={to}
          min={minLimit}
        />
        <NumberInput
          label="Till"
          onChange={(event) => onToChange(convertTimePeriodValue(event.currentTarget.value, from, maxLimit))}
          value={to}
          max={maxLimit}
          min={from}
        />
      </div>
    </>
  )
}
