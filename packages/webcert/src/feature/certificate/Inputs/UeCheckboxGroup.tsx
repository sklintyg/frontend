import React from 'react'
import { CertificateDataElement, QuestionValidationTexts } from '@frontend/common'
import { useSelector } from 'react-redux'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../store/certificate/certificateSelectors'
import { CertificateDataValueType, ConfigUeCheckboxMultipleCodes, ValueCodeList } from '@frontend/common/src'
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
        //TODO : MOVE VALUE
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

//const isDisabled = (id: string) => {}

function getCodeList(question: CertificateDataElement): ValueCodeList | null {
  if (question.value?.type !== CertificateDataValueType.CODE_LIST) {
    return null
  }
  return question.value as ValueCodeList
}

export default UeCheckboxGroup
