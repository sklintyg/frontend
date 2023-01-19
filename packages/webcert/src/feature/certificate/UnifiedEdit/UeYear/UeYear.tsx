import {
  CertificateDataElement,
  ConfigUeYear,
  DatePickerCustom,
  getValidDate,
  QuestionValidationTexts,
  ValidationError,
  ValueYear,
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

const UeYear: React.FC<Props> = ({ question, disabled }) => {
  const dispatch = useDispatch()
  const questionValue = question.value as ValueYear
  const questionConfig = question.config as ConfigUeYear
  const [yearString, setYearString] = useState<string | null>(questionValue.year?.toString() ?? '')
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))

  const handleChange = (date: string) => {
    const text = date.split('-')[0]
    setYearString(text)

    if (isValid(getValidDate(date)) || date === '') {
      dispatch(
        updateCertificateDataElement({
          ...question,
          value: { ...questionValue, year: parseInt(text) },
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
        inputString={yearString}
        questionId={question.id}
        max={questionConfig.maxYear}
        min={questionConfig.minYear}
        displayValidationErrorOutline={validationErrors.length > 0}
        onDispatchValidationError={dispatchValidationError}
        componentField={questionConfig.id}
        yearOnly={true}
      />
      <ValidationWrapper>
        <QuestionValidationTexts validationErrors={validationErrors} />
      </ValidationWrapper>
    </>
  )
}

export default UeYear
