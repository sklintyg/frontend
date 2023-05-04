import { useState } from 'react'
import { SelectMultiple } from '../../Form/SelectMultiple'
import { Checkbox } from '../../Form/Checkbox'
import { SickLeaveLengthInterval } from '../../../schemas/sickLeaveSchema'

export function TimePeriodFilter({
  label,
  description,
  onChange,
}: {
  label: string
  description: string
  onChange: (intervals: SickLeaveLengthInterval[]) => void
}) {
  const [chosenOptions, setChosenOptions] = useState<TimePeriodOption[]>([])

  enum TimePeriodMetric {
    DAYS = 'DAYS',
    YEARS = 'YEARS',
  }

  interface TimePeriodOption {
    from: number | null
    to: number | null
    metric: TimePeriodMetric
    id: number
  }

  const availableOptions = [
    { from: 0, to: 14, metric: TimePeriodMetric.DAYS, id: 1 },
    { from: 15, to: 30, metric: TimePeriodMetric.DAYS, id: 2 },
    { from: 31, to: 90, metric: TimePeriodMetric.DAYS, id: 3 },
    { from: 91, to: 180, metric: TimePeriodMetric.DAYS, id: 4 },
    { from: 181, to: 365, metric: TimePeriodMetric.DAYS, id: 5 },
    { from: 1, to: 2, metric: TimePeriodMetric.YEARS, id: 6 },
    { from: 2, to: null, metric: TimePeriodMetric.YEARS, id: 7 },
  ]

  const getLabel = (option: TimePeriodOption) => {
    const metricLabel = option.metric === TimePeriodMetric.DAYS ? 'dagar' : 'år'

    if (option.to) {
      return `${option.from}-${option.to} ${metricLabel}`
    }

    return `Över ${option.from} ${metricLabel}`
  }

  const convertTimePeriod = (period: TimePeriodOption) => {
    if (period.metric === TimePeriodMetric.YEARS) {
      return {
        to: !period.to ? period.to : period.to * 365,
        from: !period.from ? period.from : period.from * 365,
      }
    }

    return {
      to: period.to,
      from: period.from,
    }
  }

  const handleOnChange = (option: TimePeriodOption, isAdded: boolean) => {
    let options
    if (isAdded) {
      options = chosenOptions.slice()
      options.push(option)
    } else {
      options = chosenOptions.filter((chosenOption) => chosenOption.id !== option.id)
    }

    setChosenOptions(options)
    onChange(options.map((o) => convertTimePeriod(o)))
  }

  return (
    <SelectMultiple
      label={label}
      description={description}
      options={availableOptions.map((option) => (
        <Checkbox
          key={`${option.to}${option.from}${option.id}`}
          label={getLabel(option)}
          onChange={(event) => handleOnChange(option, event.currentTarget.checked)}
          checked={chosenOptions.some((chosenOption) => chosenOption.id === option.id)}
        />
      ))}
      placeholder="Välj"
    />
  )
}
