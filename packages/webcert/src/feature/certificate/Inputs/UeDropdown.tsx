import React from 'react'
import { Dropdown, CertificateDataElement, ConfigUeDropdown, QuestionValidationTexts, ValueCode } from '@frontend/common'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../store/store'
import { useSelector } from 'react-redux'
import { getShowValidationErrors } from '../../../store/certificate/certificateSelectors'

interface Props {
  hasValidationError?: boolean
  disabled?: boolean
  question: CertificateDataElement
}

const UeDropdown: React.FC<Props> = (props) => {
  const { question, hasValidationError, disabled } = props
  const dispatch = useAppDispatch()
  const config = question.config as ConfigUeDropdown
  const isShowValidationError = useSelector(getShowValidationErrors)

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const updatedValue = getUpdatedValue(question, event.currentTarget.value)
    dispatch(updateCertificateDataElement(updatedValue))
  }

  const getUpdatedValue = (question: CertificateDataElement, selected: string) => {
    const updatedQuestion: CertificateDataElement = { ...question }
    const updatedQuestionValue = { ...(updatedQuestion.value as ValueCode) }
    updatedQuestionValue.id = selected
    updatedQuestionValue.code = selected
    updatedQuestion.value = updatedQuestionValue
    return updatedQuestion
  }

  return (
    <div>
      <Dropdown
        id={question.id}
        label={question.config.label + ''}
        options={config.list.map((item, i) => (
          <option key={item.id} value={item.id} label={item.label} />
        ))}
        disabled={disabled}
        onChange={handleChange}
        value={(question.value as ValueCode).code}
        hasValidationError={hasValidationError}
      />
      {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>}
    </div>
  )
}
export default UeDropdown
