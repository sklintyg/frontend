import { Checkbox } from '../../../../components/Form/Checkbox'
import { SelectMultiple } from '../../../../components/Form/SelectMultiple'
import { SickLeaveLengthInterval } from '../../../../schemas/sickLeaveSchema'
import { TimePeriodMetric, TimePeriodOption } from '../../../../schemas/timePeriodOptionSchema'
import { getSickLeaveLengthLabel, getSickLeaveLengthPlaceholder } from '../../utils/getSickLeaveLengthPlaceholder'

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
  const convertSelectedValue = (value: number | null, metric: TimePeriodMetric) =>
    value && value >= 365 && metric === TimePeriodMetric.YEARS ? value / 365 : value

  const chosenOptions = availableOptions.filter((o1) =>
    selectedOptions.find((o2) => o1.to === convertSelectedValue(o2.to, o1.metric) && o1.from === convertSelectedValue(o2.from, o1.metric))
  )

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

    onChange(options.map((o) => convertTimePeriod(o)))
  }

  return (
    <SelectMultiple label={label} description={description} placeholder={getSickLeaveLengthPlaceholder(chosenOptions)}>
      {availableOptions.map((option) => (
        <Checkbox
          key={`${option.to}${option.from}${option.id}`}
          label={getSickLeaveLengthLabel(option)}
          onChange={(event) => handleOnChange(option, event.currentTarget.checked)}
          checked={chosenOptions.some((chosenOption) => chosenOption.id === option.id)}
        />
      ))}
    </SelectMultiple>
  )
}
