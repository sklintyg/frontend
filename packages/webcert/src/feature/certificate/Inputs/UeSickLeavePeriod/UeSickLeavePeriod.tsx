import React, { useState, useRef } from 'react'
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
} from '@frontend/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import _ from 'lodash'
import { isValid, addDays } from 'date-fns'
import { DaysRangeWrapper, TextInput } from './Styles'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../../store/certificate/certificateSelectors'

interface Props {
  question: CertificateDataElement
  disabled: boolean
}

export const UeSickLeavePeriod: React.FC<Props> = ({ question, disabled }) => {
  const [hours, setHours] = useState<number | null>(null)
  const [valueList, setValueList] = useState<ValueDateRange[]>((question.value as ValueDateRangeList).list)
  const dispatch = useDispatch()
  const isShowValidationError = useSelector(getShowValidationErrors)
  const shouldDisplayValidationError = useSelector(getQuestionHasValidationError(question.id))

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
    _.debounce((valueList: ValueDateRange[]) => {
      const updatedQuestion = getUpdatedValue(valueList)
      dispatch(updateCertificateDataElement(updatedQuestion))
    }, 1000)
  ).current

  const handleUpdatedValue = (valueId: string, fromDate: string | null, toDate: string | null) => {
    const updatedValueList = getUpdatedValueList(valueId, fromDate, toDate)
    setValueList(updatedValueList)
    dispatchEditDraft(updatedValueList)
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

    return updatedValueList
  }

  function getUpdatedValue(valueList: ValueDateRange[]) {
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

  if (!question) return null

  return (
    <div>
      <div>
        <DaysRangeWrapper>
          <FontAwesomeIcon icon={faLightbulb} className="iu-color-main" size="lg" />
          <p>Patienten arbetar i snitt</p>
          <TextInput className="ic-textfield" type="text" value={hours?.toString()} maxLength={2} />
          <p>timmar/vecka</p>
        </DaysRangeWrapper>
      </div>
      <div>
        {(question.config as ConfigUeSickLeavePeriod).list.map((period: ConfigUeCheckboxDateRange, i) => {
          return (
            <DateRangePicker
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
      </div>
    </div>
  )
}
