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
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  to: string
  from: string
}) {
  const maxLimit = '365'
  const minLimit = '1'

  const convertTimePeriodValue = (value: string, min: string, max: string, defaultValue: string) => {
    if (value === '' || value === '0') {
      return defaultValue
    }

    if (Number(value) < Number(min)) {
      return min
    }

    if (Number(value) > Number(max)) {
      return max
    }

    return value
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
          onBlur={() => onFromChange(convertTimePeriodValue(from, minLimit, to, minLimit))}
          onChange={(event) => onFromChange(event?.currentTarget.value)}
          value={from === '0' ? '' : from}
          inline
          max={to}
          min={minLimit}
        />
        <NumberInput
          label="Till"
          onBlur={() => onToChange(convertTimePeriodValue(to, from, maxLimit, maxLimit))}
          onChange={(event) => onToChange(event.currentTarget.value)}
          value={to === '0' ? '' : to}
          inline
          max={maxLimit}
          min={from}
        />
      </div>
    </>
  )
}
