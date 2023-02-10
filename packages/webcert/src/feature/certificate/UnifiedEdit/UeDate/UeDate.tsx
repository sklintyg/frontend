import {
  CertificateDataElement,
  ConfigUeDate,
  DatePickerCustom,
  getMaxDate,
  getMinDate,
  QuestionValidationTexts,
  ValidationWrapper,
  ValueDate,
} from '@frontend/common'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
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

    dispatch(
      updateCertificateDataElement({
        ...question,
        value: { ...questionValue, date },
      })
    )
  }

  return (
    <>
      <DatePickerCustom
        disabled={disabled}
        textInputOnChange={handleChange}
        setDate={handleChange}
        inputString={dateString}
        max={getMaxDate(question.validation, questionConfig.id)}
        min={getMinDate(question.validation, questionConfig.id)}
        displayValidationErrorOutline={validationErrors.length > 0}
      />
      <ValidationWrapper>
        <QuestionValidationTexts validationErrors={validationErrors} />
      </ValidationWrapper>
    </>
  )
}

export default UeDate
