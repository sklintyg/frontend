import { addDays, isValid } from 'date-fns'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import type { ConfigUeCheckboxDateRangeList, ValueDateRange, ValueDateRangeList } from '../../../../types'
import { CertificateDataValueType } from '../../../../types'
import { formatDateToString, getLatestPeriodEndDate, getNumberOfPeriodDays } from '../../../../utils'
import type { UnifiedEdit } from '../UnifiedEdit'
import { PreviousPeriod } from './PreviousPeriod'
import { TotalDays } from './TotalDays'
import { UeCheckboxDateRangeListField } from './UeCheckboxDateRangeListField'
import { UeCheckboxDateRangeListWarning } from './UeCheckboxDateRangeListWarning'
import { WorkingHours } from './WorkingHours'

function createEmptyDateRangeValue(id: string): ValueDateRange {
  return {
    type: CertificateDataValueType.DATE_RANGE,
    id,
    from: undefined,
    to: undefined,
  }
}

function getUpdatedList(list: ValueDateRange[], item: ValueDateRange) {
  return list
    .filter(({ id }) => id !== item.id)
    .concat({
      ...item,
      from: item.from && item.from.length > 0 ? item.from : undefined,
      to: item.to && item.to.length > 0 ? item.to : undefined,
    })
    .filter(({ from, to }) => !(from == null && to == null))
}

export function UeCheckboxDateRangeList({
  question: { id, config, value, parent },
  disabled,
  onUpdate,
}: UnifiedEdit<ConfigUeCheckboxDateRangeList, ValueDateRangeList>) {
  const [baseWorkHours, setBaseWorkHours] = useState('')
  const [valueList, setValueList] = useState(value.list)
  const validationErrors = useSelector(getVisibleValidationErrors(id))

  const otherValiadtionErrors = useMemo(() => {
    const fieldNames = config.list
      .map(({ id }) => [
        `from.${id}`,
        `${id}.from`,
        `tom.${id}`,
        `${id}.tom`,
        `${id}.to`,
        `row.${id}`,
        `sjukskrivningar.period.${id}.tom`,
        `sjukskrivningar.period.${id}.from`,
        id,
      ])
      .flat()
    return validationErrors.filter(({ field }) => !fieldNames.includes(field))
  }, [config.list, validationErrors])

  const periodStartingDate = useMemo(() => {
    const nextPeriodStart = getLatestPeriodEndDate(config.list, valueList)
    if (isValid(nextPeriodStart) && nextPeriodStart) {
      return formatDateToString(addDays(nextPeriodStart, 1))
    }
    return formatDateToString(new Date())
  }, [config.list, valueList])

  return (
    <div>
      {config.previousDateRangeText && <PreviousPeriod previousPeriod={config.previousDateRangeText} />}
      {!config.hideWorkingHours && (
        <WorkingHours id={id} parent={parent} disabled={disabled} baseWorkHours={baseWorkHours} onBaseWorkHours={setBaseWorkHours} />
      )}
      <div>
        {config.label && <label>{config.label}</label>}
        {config.list.map(({ id, label }) => (
          <UeCheckboxDateRangeListField
            key={id}
            field={id}
            label={label}
            baseWorkHours={baseWorkHours}
            disabled={disabled}
            periodStartingDate={periodStartingDate}
            value={valueList.find((x) => x.id === id) ?? createEmptyDateRangeValue(id)}
            max={config.max}
            min={config.min}
            hasValidationError={otherValiadtionErrors.length > 0}
            validationErrors={validationErrors.filter(
              ({ field }) =>
                field &&
                [
                  `from.${id}`,
                  `${id}.from`,
                  `tom.${id}`,
                  `${id}.tom`,
                  `${id}.to`,
                  `row.${id}`,
                  `sjukskrivningar.period.${id}.tom`,
                  `sjukskrivningar.period.${id}.from`,
                  id,
                ].includes(field)
            )}
            onChange={(item: ValueDateRange) => {
              const updatedList = getUpdatedList(valueList, item)
              setValueList(updatedList)
              onUpdate({ ...value, list: updatedList })
            }}
          />
        ))}
      </div>
      <QuestionValidationTexts validationErrors={otherValiadtionErrors} />
      {(!config.hideWorkingHours || !disabled) && <TotalDays total={getNumberOfPeriodDays(value.list)} />}
      <UeCheckboxDateRangeListWarning />
    </div>
  )
}
