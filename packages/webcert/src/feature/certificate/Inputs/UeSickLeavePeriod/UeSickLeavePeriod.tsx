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
} from '@frontend/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import _ from 'lodash'
import { isValid, addDays } from 'date-fns'
import { DaysRangeWrapper, TextInput } from './Styles'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { SickLeavePeriodWarning } from './SickLeavePeriodWarning'

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
    setBaseWorkHours(event.target.value)
  }

  if (!question) return null

  return (
    <div>
      <div>
        {!question.disabled && (
          <DaysRangeWrapper>
            <FontAwesomeIcon icon={faLightbulb} className="iu-color-main" size="lg" />
            <p>Patienten arbetar i snitt</p>
            <TextInput
              onChange={handleWorkingHoursOnChange}
              className="ic-textfield"
              value={baseWorkHours}
              type="text"
              maxLength={2}
              pattern="\d*"
            />
            <p>timmar/vecka</p>
          </DaysRangeWrapper>
        )}
      </div>
      <div>
        {(question.config as ConfigUeSickLeavePeriod).list.map((period: ConfigUeCheckboxDateRange, i) => {
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
        {totalSickDays && !question.disabled && (
          <>
            <p className="iu-color-main">
              <FontAwesomeIcon icon={faLightbulb} className="iu-color-main iu-mr-200" size="lg" />
              Intyget motsvarar en period på {totalSickDays} dagar.
            </p>
          </>
        )}
        <SickLeavePeriodWarning />
      </div>
    </div>
  )
}
