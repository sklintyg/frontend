import React from 'react'
import { CertificateDataElement, QuestionValidationTexts, ConfigUeCheckboxMultipleCodes } from '@frontend/common'
import { useSelector } from 'react-redux'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../store/certificate/certificateSelectors'
import UeCheckbox from './UeCheckbox'

interface Props {
  disabled: boolean
  question: CertificateDataElement
}

const UeCheckboxGroup: React.FC<Props> = ({ question, disabled }) => {
  const checkboxes = (question.config as ConfigUeCheckboxMultipleCodes).list
  const isShowValidationError = useSelector(getShowValidationErrors)
  const shouldDisplayValidationError = useSelector(getQuestionHasValidationError(question.id))

  const renderCheckboxes = () => {
    if (!checkboxes) {
      return null
    }
    return checkboxes.map((checkbox, index) => (
      <UeCheckbox
        id={checkbox.id}
        key={index}
        label={checkbox.label}
        disabled={disabled || checkbox.disabled}
        hasValidationError={shouldDisplayValidationError}
        question={question}
      />
    ))
  }

  return (
    <div className="checkbox-group-wrapper">
      <div>
        <div className="checkbox-child">{renderCheckboxes()}</div>
        {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>}
      </div>
    </div>
  )
}

export default UeCheckboxGroup
