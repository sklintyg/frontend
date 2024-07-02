import type React from 'react';
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DatePickerCustom, { ValidationWrapper } from '../../../../components/Inputs/DatePickerCustom/DatePickerCustom'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import type { CertificateDataElement, ConfigUeYear, ValueYear } from '../../../../types'

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

    dispatch(
      updateCertificateDataElement({
        ...question,
        value: { ...questionValue, year: text === '' ? undefined : parseInt(text) },
      })
    )
  }

  return (
    <>
      <DatePickerCustom
        disabled={disabled}
        textInputOnChange={handleChange}
        setDate={handleChange}
        inputString={yearString}
        max={questionConfig.maxYear?.toString()}
        min={questionConfig.minYear ? (questionConfig.minYear - 1).toString() : ''}
        displayValidationErrorOutline={validationErrors.length > 0}
        yearOnly={true}
      />
      <ValidationWrapper>
        <QuestionValidationTexts validationErrors={validationErrors} />
      </ValidationWrapper>
    </>
  )
}

export default UeYear
