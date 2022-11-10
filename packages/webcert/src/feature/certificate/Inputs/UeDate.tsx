import {
  CertificateDataElement,
  DatePickerCustom,
  getMaxDate,
  getValidDate,
  QuestionValidationTexts,
  ValidationError,
  ValueDate,
} from '@frontend/common'
import { ValidationWrapper } from '@frontend/common/src/components/Inputs/DatePickerCustom/Styles'
import { ConfigUeDate } from '@frontend/common/src/types/certificate'
import { isValid } from 'date-fns'
import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateCertificateDataElement, updateClientValidationError } from '../../../store/certificate/certificateActions'
import { getVisibleValidationErrors, getShowValidationErrors } from '../../../store/certificate/certificateSelectors'

export interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const UeDate: React.FC<Props> = ({ question, disabled }) => {
  const dispatch = useDispatch()
  const questionValue = question.value as ValueDate
  const questionConfig = question.config as ConfigUeDate
  const [dateString, setDateString] = useState<string | null>(questionValue.date ?? '')
  const isShowValidationError = useSelector(getShowValidationErrors)
  const validationErrors = [
    ...useSelector(getVisibleValidationErrors(question.id, questionConfig.id)),
    ...(question.validationErrors || []),
  ]

  const deleteDateFromSavedValue = () => {
    dispatch(updateCertificateDataElement(getUpdatedDateValue(question, questionConfig.id, '')))
  }

  const handleChange = (date: string) => {
    setDateString(date)

    if (date === '') {
      deleteDateFromSavedValue()
    }

    const parsedDate = getValidDate(date)

    if (isValid(parsedDate)) {
      dispatch(updateCertificateDataElement(getUpdatedDateValue(question, questionConfig.id, date)))
    }
  }

  const dispatchValidationError = useCallback(
    (shouldBeRemoved: boolean, validationError: ValidationError) => {
      dispatch(updateClientValidationError({ shouldBeRemoved, validationError }))
    },
    [dispatch]
  )

  return (
    <>
      <DatePickerCustom
        disabled={disabled}
        textInputOnChange={(value: string) => {
          handleChange(value)
        }}
        setDate={(date: string) => {
          handleChange(date)
        }}
        inputString={dateString}
        questionId={question.id}
        max={getMaxDate(question.validation, questionConfig.id)}
        displayValidationErrorOutline={isShowValidationError}
        onDispatchValidationError={dispatchValidationError}
        componentField={questionConfig.id}
      />
      {isShowValidationError && (
        <ValidationWrapper>
          <QuestionValidationTexts validationErrors={validationErrors} />
        </ValidationWrapper>
      )}
    </>
  )
}

const getUpdatedDateValue = (question: CertificateDataElement, id: string, date: string) => {
  const updatedQuestion: CertificateDataElement = { ...question }

  const updatedValue = { ...(updatedQuestion.value as ValueDate) }
  updatedValue.id = id
  updatedValue.date = date

  updatedQuestion.value = updatedValue

  return updatedQuestion
}

export default UeDate
