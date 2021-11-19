import React, { useState, useRef, useEffect } from 'react'
import DateRangePicker from './DateRangePicker'
import {
  CertificateDataElement,
  ConfigUeSickLeavePeriod,
  formatDateToString,
  getLatestPeriodEndDate,
  ValueDateRange,
  getPeriodHasOverlap,
  ValueDateRangeList,
  ConfigUeCheckboxDateRange,
  QuestionValidationTexts,
  ValidationError,
  CertificateDataValueType,
  filterDateRangeValueList,
  getNumberOfSickLeavePeriodDays,
  Icon,
} from '@frontend/common'
import { useDispatch, useSelector } from 'react-redux'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import _ from 'lodash'
import { isValid, addDays } from 'date-fns'
import { DaysRangeWrapper, TextInput } from './Styles'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { SickLeavePeriodWarning } from './SickLeavePeriodWarning'
import { PreviousSickLeavePeriod } from './PreviousSickLeavePeriod'

interface Props {
  question: CertificateDataElement
  disabled: boolean
}

export const UeSickLeavePeriod: React.FC<Props> = ({ question, disabled }) => {
  const [baseWorkHours, setBaseWorkHours] = useState<string>('')
  const [valueList, setValueList] = useState<ValueDateRange[]>((question.value as ValueDateRangeList).list)
  const dispatch = useDispatch()
  const isShowValidationError = useSelector(getShowValidationErrors)
  const shouldDisplayValidationError = useSelector(getQuestionHasValidationError(question.id))
  const [totalSickDays, setTotalSickDays] = useState<number | null>(null)

  useEffect(() => {
    updateTotalSickDays((question.value as ValueDateRangeList).list)
  }, [])

  const overlapErrors: ValidationError[] = [
    {
      category: question.parent,
      id: question.id,
      text: 'Ange sjukskrivningsperioder som inte överlappar varandra.',
      type: '',
      field: '',
    },
  ]

  const dispatchEditDraft = useRef(
    _.debounce((question: CertificateDataElement, valueList: ValueDateRange[]) => {
      const updatedQuestion = getUpdatedValue(question, valueList)
      dispatch(updateCertificateDataElement(updatedQuestion))
    }, 1000)
  ).current

  const handleUpdatedValue = (valueId: string, fromDate: string | null, toDate: string | null) => {
    const updatedValueList = getUpdatedValueList(valueId, fromDate, toDate)
    setValueList(updatedValueList)
    dispatchEditDraft(question, updatedValueList)
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
      return formatDateToString(addDays(nextPeriodStart!, 1))
    }

    return formatDateToString(new Date())
  }

  const hasAnyOverlap = () => {
    return valueList.some((val) => getPeriodHasOverlap(valueList, val.id))
  }

  const handleGetPeriodHaveOverlap = (periodId: string) => {
    return getPeriodHasOverlap(valueList, periodId)
  }

  const handleWorkingHoursOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBaseWorkHours(event.target.value.replace(/[^0-9]/g, ''))
  }

  if (!question) return null

  const config = question.config as ConfigUeSickLeavePeriod

  return (
    <div>
      <PreviousSickLeavePeriod previousSickLeavePeriod={config.previousSickLeavePeriod} />
      <div>
        {!disabled && (
          <DaysRangeWrapper>
            <Icon iconType={'lightbulb_outline'} includeTooltip={true} />
            <p>Patienten arbetar i snitt</p>
            <TextInput onChange={handleWorkingHoursOnChange} className="ic-textfield" value={baseWorkHours} type="text" maxLength={2} />
            <p>timmar/vecka</p>
          </DaysRangeWrapper>
        )}
      </div>
      <div>
        {config.list.map((period: ConfigUeCheckboxDateRange, i) => {
          return (
            <DateRangePicker
              baseWorkHours={baseWorkHours}
              disabled={disabled}
              hasValidationError={shouldDisplayValidationError}
              hasOverlap={handleGetPeriodHaveOverlap(period.id)}
              getPeriodStartingDate={handleGetPeriodStartingDate}
              updateValue={handleUpdatedValue}
              key={period.id}
              fromDate={valueList.find((x) => x.id === period.id)?.from ?? null}
              toDate={valueList.find((x) => x.id === period.id)?.to ?? null}
              label={period.label}
              periodId={period.id}
            />
          )
        })}
        {hasAnyOverlap() && <QuestionValidationTexts validationErrors={overlapErrors}></QuestionValidationTexts>}
        {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>}
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
