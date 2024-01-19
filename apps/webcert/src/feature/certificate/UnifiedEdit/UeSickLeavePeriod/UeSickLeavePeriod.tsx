import { addDays, isValid } from 'date-fns'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import Icon from '../../../../components/image/image/Icon'
import Accordion from '../../../../components/utils/Accordion'
import AccordionHeader from '../../../../components/utils/AccordionHeader'
import { Text } from '../../../../components/utils/Text'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import {
  CertificateDataElement,
  CertificateDataValueType,
  ConfigUeSickLeavePeriod,
  ValidationError,
  ValueDateRange,
  ValueDateRangeList,
} from '../../../../types'
import { formatDateToString, getLatestPeriodEndDate, getNumberOfSickLeavePeriodDays } from '../../../../utils'
import DateRangePicker from './DateRangePicker'
import { PreviousSickLeavePeriod } from './PreviousSickLeavePeriod'
import { SickLeavePeriodWarning } from './SickLeavePeriodWarning'
import { WorkingHoursInput } from './WorkingHoursInput'

const AccodrionWrapper = styled.div`
  flex: 0 0 100%;
`

const DaysRangeWrapper = styled.div`
  display: flex;
  align-items: center;

  > * + * {
    margin-left: 0.5rem;
  }

  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }
`

export interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const createEmptyDateRangeValue = (id: string): ValueDateRange => ({
  type: CertificateDataValueType.DATE_RANGE,
  id,
  from: undefined,
  to: undefined,
})

export const UeSickLeavePeriod: React.FC<Props> = ({ question, disabled }) => {
  const [baseWorkHours, setBaseWorkHours] = useState<string>('')
  const [valueList, setValueList] = useState<ValueDateRange[]>((question.value as ValueDateRangeList).list)
  const dispatch = useDispatch()
  const [totalSickDays, setTotalSickDays] = useState<number | null>(null)
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))
  const config = question.config as ConfigUeSickLeavePeriod

  const otherValiadtionErrors = useMemo(() => {
    const fieldNames: string[] = config.list
      .map(({ id }) => [
        `sjukskrivningar.period.${id}.tom`,
        `sjukskrivningar.period.${id}.from`,
        `${id}.tom`,
        `from.${id}`,
        `tom.${id}`,
        `row.${id}`,
        id,
      ])
      .flat()
    return validationErrors.filter(({ field }) => !fieldNames.includes(field))
  }, [config.list, validationErrors])

  useEffect(() => {
    updateTotalSickDays((question.value as ValueDateRangeList).list)
  }, [question.value])

  const handleValueChanged = (value: ValueDateRange) => {
    const updatedList = valueList
      .filter(({ id }) => id !== value.id)
      .concat({
        ...value,
        from: value.from && value.from.length > 0 ? value.from : undefined,
        to: value.to && value.to.length > 0 ? value.to : undefined,
      })
      .filter(({ from, to }) => !(from == null && to == null))

    setValueList(updatedList)
    dispatch(
      updateCertificateDataElement({
        ...question,
        value: { ...question.value, list: updatedList },
      } as CertificateDataElement)
    )
  }

  const updateTotalSickDays = (values: ValueDateRange[]) => {
    const totalSickDays = getNumberOfSickLeavePeriodDays(values)

    if (totalSickDays > 0) {
      setTotalSickDays(totalSickDays)
    } else {
      setTotalSickDays(null)
    }
  }

  const handleGetPeriodStartingDate = () => {
    const nextPeriodStart = getLatestPeriodEndDate((question.config as ConfigUeSickLeavePeriod).list, valueList)

    if (isValid(nextPeriodStart)) {
      return formatDateToString(addDays(nextPeriodStart as Date, 1))
    }

    return formatDateToString(new Date())
  }

  if (!question) return null

  const workingHoursError: ValidationError | undefined =
    parseInt(baseWorkHours) > 168
      ? {
          category: question.parent,
          id: question.id,
          text: 'Ange ett giltigt antal arbetstimmar. Arbetstiden kan inte överstiga 168 timmar per vecka.',
          type: 'WORKING_HOURS_ERROR',
          field: 'WORKING_HOURS',
          showAlways: true,
        }
      : undefined

  return (
    <div>
      <PreviousSickLeavePeriod previousSickLeavePeriod={config.previousSickLeavePeriod} />
      <div>
        {!disabled && (
          <>
            <DaysRangeWrapper>
              <AccodrionWrapper id={'workHours'}>
                <Accordion>
                  <AccordionHeader>
                    <WorkingHoursInput
                      onChange={(event) => setBaseWorkHours(event.target.value.replace(/[^0-9]/g, ''))}
                      value={baseWorkHours}
                      hasValidationError={workingHoursError != null}
                    />
                  </AccordionHeader>
                  <Text className="iu-mb-400">
                    Ange hur många timmar patienten arbetar i snitt per vecka. Maximal arbetstid som kan anges är 168 timmar per vecka.
                    Observera att denna funktion endast är ett stöd för att tydliggöra hur många timmar per vecka patienten bedöms kunna
                    arbeta när en viss nedsättning av arbetsförmåga har angivits. Uppgiften lagras inte som en del av intyget då
                    Försäkringskassan inhämtar information från annat håll.
                  </Text>
                </Accordion>
              </AccodrionWrapper>
            </DaysRangeWrapper>
            <QuestionValidationTexts validationErrors={workingHoursError ? [workingHoursError] : []} />
          </>
        )}
      </div>
      <div>
        {config.list.map(({ id, label }, index) => {
          const fieldValidationErrors = validationErrors.filter(
            ({ field }) =>
              field &&
              [
                `sjukskrivningar.period.${id}.tom`,
                `sjukskrivningar.period.${id}.from`,
                `from.${id}`,
                `tom.${id}`,
                `row.${id}`,
                id,
              ].includes(field)
          )
          return (
            <DateRangePicker
              baseWorkHours={baseWorkHours}
              disabled={disabled}
              getPeriodStartingDate={handleGetPeriodStartingDate}
              key={index}
              value={valueList.find((x) => x.id === id) ?? createEmptyDateRangeValue(id)}
              label={label}
              field={id}
              hasValidationError={otherValiadtionErrors.length > 0}
              validationErrors={fieldValidationErrors}
              onChange={handleValueChanged}
            />
          )
        })}
      </div>
      <QuestionValidationTexts validationErrors={otherValiadtionErrors} />
      {totalSickDays && !disabled && (
        <div className="iu-mb-400">
          <p className="iu-color-main">
            <Icon iconType={'lightbulb_outline'} includeTooltip={true} />
            Intyget motsvarar en period på {totalSickDays} dagar.{' '}
          </p>
        </div>
      )}
      <SickLeavePeriodWarning />
    </div>
  )
}
