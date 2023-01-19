import {
  Accordion,
  AccordionHeader,
  CertificateDataElement,
  ConfigUeCheckboxDateRange,
  ConfigUeSickLeavePeriod,
  formatDateToString,
  getLatestPeriodEndDate,
  getNumberOfSickLeavePeriodDays,
  getPeriodHasOverlap,
  Icon,
  QuestionValidationTexts,
  Text,
  ValueDateRange,
  ValueDateRangeList,
  ValidationError,
  CertificateDataValueType,
} from '@frontend/common'
import { addDays, isValid } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import DateRangePicker from './DateRangePicker'
import { PreviousSickLeavePeriod } from './PreviousSickLeavePeriod'
import { SickLeavePeriodWarning } from './SickLeavePeriodWarning'
import { DaysRangeWrapper } from './Styles'
import { WorkingHoursInput } from './WorkingHoursInput'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'

const AccodrionWrapper = styled.div`
  flex: 0 0 100%;
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
  const validationErrors = useSelector(getVisibleValidationErrors(question.id, question.id))

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
      })
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

  const handleGetPeriodHaveOverlap = (periodId: string) => {
    return getPeriodHasOverlap(valueList, periodId)
  }

  if (!question) return null

  const config = question.config as ConfigUeSickLeavePeriod

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
                    <Icon iconType={'lightbulb_outline'} includeTooltip={true} size={'sm'} />
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
            <div className="iu-pb-500">
              <QuestionValidationTexts validationErrors={workingHoursError ? [workingHoursError] : []} />
            </div>
          </>
        )}
      </div>
      <div className={'iu-pt-300'}>
        {config.list.map((period: ConfigUeCheckboxDateRange) => {
          return (
            <DateRangePicker
              baseWorkHours={baseWorkHours}
              disabled={disabled}
              hasValidationError={
                (validationErrors.length > 0 && validationErrors.some((v) => v.type !== 'OVERLAP_ERROR')) ||
                handleGetPeriodHaveOverlap(period.id)
              }
              getPeriodStartingDate={handleGetPeriodStartingDate}
              key={period.id}
              value={valueList.find((x) => x.id === period.id) ?? createEmptyDateRangeValue(period.id)}
              label={period.label}
              field={period.id}
              questionId={question.id}
              onChange={handleValueChanged}
            />
          )
        })}
        <div className={'iu-pb-500'}>
          <QuestionValidationTexts validationErrors={validationErrors} />
        </div>
        {totalSickDays && !disabled && (
          <div>
            <p className="iu-color-main">
              <Icon iconType={'lightbulb_outline'} includeTooltip={true} />
              Intyget motsvarar en period på {totalSickDays} dagar.{' '}
            </p>
          </div>
        )}
        <SickLeavePeriodWarning />
      </div>
    </div>
  )
}
