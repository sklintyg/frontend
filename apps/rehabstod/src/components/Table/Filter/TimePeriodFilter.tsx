import { useState } from 'react'
import { SelectMultiple } from '../../Form/SelectMultiple'
import { Checkbox } from '../../Form/Checkbox'
import { SickLeaveLengthInterval } from '../../../schemas/sickLeaveSchema'

export enum TimePeriodMetric {
  DAYS = 'DAYS',
  YEARS = 'YEARS',
}

export interface TimePeriodOption {
  from: number | null
  to: number | null
  metric: TimePeriodMetric
  id: number
}

export function TimePeriodFilter({
  label,
  description,
  onChange,
  availableOptions,
  selectedOptions,
}: {
  label: string
  description: string
  onChange: (intervals: SickLeaveLengthInterval[]) => void
  availableOptions: TimePeriodOption[]
  selectedOptions: SickLeaveLengthInterval[]
}) {
  const [chosenOptions, setChosenOptions] = useState<TimePeriodOption[]>(
    availableOptions.filter((option) => selectedOptions.find((selected) => selected.from === option.from && selected.to === option.to))
  )

  const getLabel = (option: TimePeriodOption) => {
    const metricLabel = option.metric === TimePeriodMetric.DAYS ? 'dagar' : 'år'

    if (option.to && option.from) {
      return `${option.from}-${option.to} ${metricLabel}`
    }

    return `${!option.to ? `Över ${option.from}` : `Under ${option.to}`} ${metricLabel}`
  }

  const getPlaceholder = () => {
    if (chosenOptions.length === 0) {
      return 'Välj'
    }

    if (chosenOptions.length === 1) {
      return getLabel(chosenOptions[0])
    }

    return `${chosenOptions.length} valda`
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
      placeholder={getPlaceholder()}
    />
  )
}
