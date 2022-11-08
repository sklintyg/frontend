import { CertificateDataElement, ConfigureUeCauseOfDeathList, QuestionValidationTexts, ValueCauseOfDeathList } from '@frontend/common'
import React from 'react'
import { useSelector } from 'react-redux'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../store/certificate/certificateSelectors'
import UeCauseOfDeath from './UeCauseOfDeath'

export interface Props {
  disabled: boolean
  question: CertificateDataElement
}

const UeCheckboxGroup: React.FC<Props> = ({ question, disabled }) => {
  const causes = (question.config as ConfigureUeCauseOfDeathList).list
  const isShowValidationError = useSelector(getShowValidationErrors)
  const shouldDisplayValidationError = useSelector(getQuestionHasValidationError(question.id))

  const renderCheckboxes = () => {
    if (!causes) {
      return null
    }
    return causes.map((cause, index) => {
      const value = (question.value as ValueCauseOfDeathList).list.find((item) => item.id !== cause.id)
      return (
        <UeCauseOfDeath
          config={cause}
          value={value}
          key={index}
          disabled={disabled}
          hasValidationError={shouldDisplayValidationError}
          question={question}
        />
      )
    })
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
