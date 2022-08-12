import React, { useEffect, useState } from 'react'
import DateRangePicker from './DateRangePicker'
import {
  CertificateDataElement,
  CertificateDataValueType,
  ConfigUeCheckboxDateRange,
  ConfigUeSickLeavePeriod,
  filterDateRangeValueList,
  formatDateToString,
  getLatestPeriodEndDate,
  getNumberOfSickLeavePeriodDays,
  getPeriodHasOverlap,
  Icon,
  QuestionValidationTexts,
  ValidationError,
  ValueDateRange,
  ValueDateRangeList,
  TextInput,
  Accordion,
} from '@frontend/common'
import { useDispatch, useSelector } from 'react-redux'
import { updateCertificateDataElement, updateClientValidationError } from '../../../../store/certificate/certificateActions'
import { addDays, isValid } from 'date-fns'
import { DaysRangeWrapper } from './Styles'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { SickLeavePeriodWarning } from './SickLeavePeriodWarning'
import { PreviousSickLeavePeriod } from './PreviousSickLeavePeriod'
import styled, { css } from 'styled-components/macro'

const AccordionStyles = css`
  flex: 0 0 100%;
`

const StyledTextInput = styled(TextInput)`
  width: 40px;
  padding: 4px 4px;
  height: 35px;
  text-align: center;
`

interface Props {
  question: CertificateDataElement
  disabled: boolean
}

export const UeSickLeavePeriod: React.FC<Props> = ({ question, disabled }) => {
  const [baseWorkHours, setBaseWorkHours] = useState<string>('')
  const [valueList, setValueList] = useState<ValueDateRange[]>((question.value as ValueDateRangeList).list)
  const dispatch = useDispatch()
  const [totalSickDays, setTotalSickDays] = useState<number | null>(null)
  const validationErrors = useSelector(getVisibleValidationErrors(question.id, question.id))
  const workingHoursErrors = useSelector(getVisibleValidationErrors(question.id, 'WORKING_HOURS'))

  useEffect(() => {
    updateTotalSickDays((question.value as ValueDateRangeList).list)
  }, [question.value])

  useEffect(() => {
    const hasAnyOverlap = () => valueList.some((val) => getPeriodHasOverlap(valueList, val.id))
    const toggleOverlapError = (shouldAddError: boolean) => {
      const overlapError: ValidationError = {
        category: question.parent,
        id: question.id,
        text: 'Ange sjukskrivningsperioder som inte överlappar varandra.',
        type: 'OVERLAP_ERROR',
        field: question.id,
        showAlways: true,
      }
      dispatch(updateClientValidationError({ shouldBeRemoved: !shouldAddError, validationError: overlapError }))
    }

    toggleOverlapError(hasAnyOverlap())
  }, [dispatch, question.id, question.parent, valueList])

  const handleUpdatedValue = (valueId: string, fromDate: string | null, toDate: string | null) => {
    const updatedValueList = getUpdatedValueList(valueId, fromDate, toDate)
    setValueList(updatedValueList)
    const updatedQuestion = getUpdatedValue(question, updatedValueList)
    dispatch(updateCertificateDataElement(updatedQuestion))
    updateTotalSickDays(updatedValueList)
  }

  const updateTotalSickDays = (values: ValueDateRange[]) => {
    const totalSickDays = getNumberOfSickLeavePeriodDays(values)

    if (totalSickDays > 0) {
      setTotalSickDays(totalSickDays)
    } else {
      setTotalSickDays(null)
    }
  }

  const getUpdatedValueList = (valueId: string, fromDate: string | null, toDate: string | null) => {
    let updatedValueList = [...valueList]

    const updatedValueIndex = updatedValueList.findIndex((val) => val.id === valueId)

    if (updatedValueIndex === -1) {
      updatedValueList = [
        ...updatedValueList,
        { from: fromDate, to: toDate, id: valueId, type: CertificateDataValueType.DATE_RANGE } as ValueDateRange,
      ]
    } else {
      updatedValueList = updatedValueList.map((val) => {
        if (val.id === valueId) {
          return { ...val, from: fromDate, to: toDate, id: valueId, type: CertificateDataValueType.DATE_RANGE } as ValueDateRange
        }
        return val
      })
    }

    return filterDateRangeValueList(updatedValueList)
  }

  function getUpdatedValue(question: CertificateDataElement, valueList: ValueDateRange[]) {
    const updatedQuestion: CertificateDataElement = { ...question }
    const updatedQuestionValue = { ...(updatedQuestion.value as ValueDateRangeList) }

    updatedQuestionValue.list = valueList
    updatedQuestion.value = updatedQuestionValue

    return updatedQuestion
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

  const handleWorkingHoursOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputNumber: number = +event.target.value.replace(/[^0-9]/g, '')

    isWorkingHoursValid(inputNumber)

    setBaseWorkHours(event.target.value.replace(/[^0-9]/g, ''))
  }

  const isWorkingHoursValid = (workingHours: number) => {
    const error: ValidationError = {
      category: question.parent,
      id: question.id,
      text: 'Ange ett giltigt antal arbetstimmar. Arbetstiden kan inte överstiga 168 timmar per vecka.',
      type: 'WORKING_HOURS_ERROR',
      field: 'WORKING_HOURS',
      showAlways: true,
    }

    const shouldBeRemoved = workingHours <= 168
    dispatch(updateClientValidationError({ shouldBeRemoved, validationError: error }))
  }

  if (!question) return null

  const config = question.config as ConfigUeSickLeavePeriod

  return (
    <div>
      <PreviousSickLeavePeriod previousSickLeavePeriod={config.previousSickLeavePeriod} />
      <div>
        {!disabled && (
          <>
            <DaysRangeWrapper>
              <Accordion
                wrapperStyles={AccordionStyles}
                titleId={'workHours'}
                icon={'lightbulb_outline'}
                iconSize={'sm'}
                includeIconTooltip={true}
                description={
                  'Ange hur många timmar patienten arbetar i snitt per vecka. Maximal arbetstid som kan anges är 168 timmar per vecka. Observera att denna funktion endast är ett stöd för att tydliggöra hur många timmar per vecka patienten bedöms kunna arbeta när en viss nedsättning av arbetsförmåga har angivits. Uppgiften lagras inte som en del av intyget då Försäkringskassan inhämtar information från annat håll.'
                }>
                <p className={'iu-fs-200 iu-fw-body'}>Patienten arbetar i snitt</p>
                <StyledTextInput
                  onChange={handleWorkingHoursOnChange}
                  value={baseWorkHours}
                  limit={3}
                  hasValidationError={workingHoursErrors.length > 0}
                  autoComplete={false}
                  className="iu-mx-200 iu-fs-200"
                  testId="workingHours"
                />
                <p className={'iu-fs-200 iu-fw-body'}>timmar/vecka</p>
              </Accordion>
            </DaysRangeWrapper>
            <div className="iu-pb-500">
              <QuestionValidationTexts validationErrors={workingHoursErrors} />
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
              updateValue={handleUpdatedValue}
              key={period.id}
              fromDate={valueList.find((x) => x.id === period.id)?.from ?? null}
              toDate={valueList.find((x) => x.id === period.id)?.to ?? null}
              label={period.label}
              periodId={period.id}
              questionId={question.id}
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
