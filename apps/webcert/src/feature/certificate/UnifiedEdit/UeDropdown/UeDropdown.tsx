import { CertificateDataElement, ConfigUeDropdown, Dropdown, QuestionValidationTexts, ValueCode } from '@frontend/common'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../../store/store'

export interface Props {
  disabled?: boolean
  question: CertificateDataElement
}

const UeDropdown: React.FC<Props> = ({ question, disabled }) => {
  const selectRef = React.useRef<HTMLSelectElement>(null)
  const dispatch = useAppDispatch()
  const config = question.config as ConfigUeDropdown
  const [currentValue, setCurrentValue] = useState(question.value as ValueCode)
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))
  const updateValue = (value: Partial<ValueCode>) => {
    setCurrentValue({ ...currentValue, ...value })
    dispatch(updateCertificateDataElement({ ...question, value: { ...currentValue, ...value } }))
  }

  useEffect(() => {
    if (!disabled && selectRef.current && selectRef.current.value !== '') {
      const event = new Event('change', { bubbles: true })
      selectRef.current.dispatchEvent(event)
    }
  }, [disabled])

  return (
    <>
      <Dropdown
        ref={selectRef}
        id={question.id}
        label={config.label}
        disabled={disabled}
        onChange={({ currentTarget: { value } }) => updateValue({ id: value, code: value })}
        value={disabled ? (question.value as ValueCode).code : currentValue.code}
        error={validationErrors.length > 0}
      >
        {config.list.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </Dropdown>
      <QuestionValidationTexts validationErrors={validationErrors} />
    </>
  )
}

export default UeDropdown
