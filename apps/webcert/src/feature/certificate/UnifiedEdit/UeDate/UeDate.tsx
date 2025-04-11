import { useState } from 'react'
import DatePickerCustom, { ValidationWrapper } from '../../../../components/Inputs/DatePickerCustom/DatePickerCustom'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppSelector } from '../../../../store/store'
import type { ConfigUeDate, ValueDate } from '../../../../types'
import type { UnifiedEdit } from '../UnifiedEdit'

function UeDate({ question: { id, config, value }, disabled, onUpdate }: UnifiedEdit<ConfigUeDate, ValueDate>) {
  const [dateString, setDateString] = useState<string | null>(value.date ?? '')
  const validationErrors = useAppSelector(getVisibleValidationErrors(id))

  const handleChange = (date: string) => {
    setDateString(date)

    onUpdate({ ...value, date })
  }

  return (
    <div>
      <DatePickerCustom
        disabled={disabled}
        textInputOnChange={handleChange}
        setDate={handleChange}
        inputString={dateString}
        max={config.maxDate}
        min={config.minDate}
        displayValidationErrorOutline={validationErrors.length > 0}
      />
      <ValidationWrapper>
        <QuestionValidationTexts validationErrors={validationErrors} />
      </ValidationWrapper>
    </div>
  )
}

export default UeDate
