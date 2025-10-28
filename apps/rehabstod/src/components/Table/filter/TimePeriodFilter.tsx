import { SelectMultiple, SelectMultipleListBox, SelectMultipleOption } from '@frontend/components'
import { useId } from 'react'
import type { SickLeaveLengthInterval } from '../../../schemas/sickLeaveSchema'
import type { TimePeriodOption } from '../../../schemas/timePeriodOptionSchema'
import { TimePeriodMetric } from '../../../schemas/timePeriodOptionSchema'
import { PrintTitle } from '../print/PrintTitle'
import { getSickLeaveLengthLabel, getSickLeaveLengthPlaceholder } from './utils/getSickLeaveLengthPlaceholder'
import { convertSelectedValue } from './utils/timePeriodConversion'

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
  const listBoxId = useId()
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
    <>
      <div className="print:hidden">
        <SelectMultiple
          listBoxId={listBoxId}
          light
          label={label}
          description={description}
          placeholder={getSickLeaveLengthPlaceholder(chosenOptions)}
        >
          <SelectMultipleListBox id={listBoxId}>
            {availableOptions.map((option) => (
              <SelectMultipleOption
                key={`${option.to}${option.from}${option.id}`}
                label={getSickLeaveLengthLabel(option)}
                onChange={(event) => handleOnChange(option, event.currentTarget.checked)}
                checked={chosenOptions.some((chosenOption) => chosenOption.id === option.id)}
              />
            ))}
          </SelectMultipleListBox>
        </SelectMultiple>
      </div>
      <div className="hidden whitespace-pre-line print:block">
        <PrintTitle title={label} />
        {selectedOptions.length === 0
          ? 'Alla valda'
          : availableOptions
              .filter((option) =>
                selectedOptions.find(
                  ({ from, to }) =>
                    convertSelectedValue(from, option.metric) === option.from && convertSelectedValue(to, option.metric) === option.to
                )
              )
              .map((option) => `${getSickLeaveLengthLabel(option)}\n`)}
      </div>
    </>
  )
}
