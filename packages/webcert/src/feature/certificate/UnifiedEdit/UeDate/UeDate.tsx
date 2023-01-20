import {
  CertificateDataElement,
  ConfigUeDate,
  DatePickerCustom,
  getMaxDate,
  getMinDate,
  getValidDate,
  QuestionValidationTexts,
  ValidationError,
  ValueDate,
} from '@frontend/common'
import { ValidationWrapper } from '@frontend/common/src/components/Inputs/DatePickerCustom/Styles'
import { isValid } from 'date-fns'
import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateCertificateDataElement, updateClientValidationError } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'

export interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const UeDate: React.FC<Props> = ({ question, disabled }) => {
  const dispatch = useDispatch()
  const questionValue = question.value as ValueDate
  const questionConfig = question.config as ConfigUeDate
  const [dateString, setDateString] = useState<string | null>(questionValue.date ?? '')
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))

  const handleChange = (date: string) => {
    setDateString(date)

    if (isValid(getValidDate(date)) || date === '') {
      dispatch(
        updateCertificateDataElement({
          ...question,
          value: { ...questionValue, date },
        })
      )
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
        textInputOnChange={handleChange}
        setDate={handleChange}
        inputString={dateString}
        questionId={question.id}
        max={getMaxDate(question.validation, questionConfig.id)}
        min={getMinDate(question.validation, questionConfig.id)}
        displayValidationErrorOutline={validationErrors.length > 0}
        onDispatchValidationError={dispatchValidationError}
        componentField={questionConfig.id}
      />
      <ValidationWrapper>
        <QuestionValidationTexts validationErrors={validationErrors} />
      </ValidationWrapper>
    </>
  )
}

export default UeDate
