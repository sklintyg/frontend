import { CertificateDataElement, DatePickerCustom, getMaxDate, QuestionValidationTexts, ValidationError } from '@frontend/common'
import { ValidationWrapper } from '@frontend/common/src/components/Inputs/DatePickerCustom/Styles'
import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateClientValidationError } from '../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../store/certificate/certificateSelectors'

export interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const UeDatePicker: React.FC<Props> = ({ question, disabled }) => {
  const dispatch = useDispatch()
  const [dateString, setDateString] = useState<string | null>('')
  const validationErrors = useSelector(getVisibleValidationErrors(question.id, question.id))

  const handleDatePickerSelect = (value: string) => {
    setDateString(value)
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
        textInputOnChange={handleDatePickerSelect}
        setDate={handleDatePickerSelect}
        inputString={dateString}
        questionId={question.id}
        max={getMaxDate(question.validation, question.id)}
        displayValidationErrorOutline={validationErrors.length > 0}
        onDispatchValidationError={dispatchValidationError}
        componentField={question.id}
      />
      <ValidationWrapper>
        <QuestionValidationTexts validationErrors={validationErrors} />
      </ValidationWrapper>
    </>
  )
}

export default UeDatePicker
