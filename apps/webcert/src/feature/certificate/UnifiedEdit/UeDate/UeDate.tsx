import { useState } from 'react'
import { useDispatch } from 'react-redux'
import DatePickerCustom, { ValidationWrapper } from '../../../../components/Inputs/DatePickerCustom/DatePickerCustom'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppSelector } from '../../../../store/store'
import type { CertificateDataElement, ConfigUeDate, ValueDate } from '../../../../types'

function UeDate({ question, disabled }: Readonly<{ question: CertificateDataElement; disabled: boolean }>) {
  const dispatch = useDispatch()
  const questionValue = question.value as ValueDate
  const questionConfig = question.config as ConfigUeDate
  const [dateString, setDateString] = useState<string | null>(questionValue.date ?? '')
  const validationErrors = useAppSelector(getVisibleValidationErrors(question.id))

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
        max={questionConfig.maxDate}
        min={questionConfig.minDate}
        displayValidationErrorOutline={validationErrors.length > 0}
      />
      <ValidationWrapper>
        <QuestionValidationTexts validationErrors={validationErrors} />
      </ValidationWrapper>
    </>
  )
}

export default UeDate
