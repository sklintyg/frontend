import { CertificateDataElement, ConfigUeDropdown, Dropdown, QuestionValidationTexts, ValueCode } from '@frontend/common'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../../store/store'

export interface Props {
  disabled?: boolean
  question: CertificateDataElement
}

const UeDropdown: React.FC<Props> = (props) => {
  const { question, disabled } = props
  const dispatch = useAppDispatch()
  const config = question.config as ConfigUeDropdown
  const [currentValue, setCurrentValue] = useState(question.value as ValueCode)
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))

  const dispatchValue = (value: ValueCode) => dispatch(updateCertificateDataElement({ ...question, value }))

  const updateValue = (value: Partial<ValueCode>) => {
    setCurrentValue({ ...currentValue, ...value })
    dispatchValue({ ...currentValue, ...value })
  }

  return (
    <>
      <Dropdown
        id={question.id}
        label={config.label}
        disabled={disabled}
        onChange={(event) => updateValue({ id: event.currentTarget.value, code: event.currentTarget.value })}
        value={currentValue.code}
        error={validationErrors.length > 0}>
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
