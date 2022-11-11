import {
  CertificateDataElement,
  ConfigureUeCauseOfDeathList,
  QuestionValidationTexts,
  ValueCauseOfDeathList,
  ValueCauseOfDeath,
} from '@frontend/common'
import React from 'react'
import { useSelector } from 'react-redux'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../store/certificate/certificateSelectors'
import UeCauseOfDeath from './UeCauseOfDeath/UeCauseOfDeath'

export interface Props {
  disabled: boolean
  question: CertificateDataElement
}

const UeCauseOfDeathList: React.FC<Props> = ({ question, disabled }) => {
  const itemCount: number | null | undefined = (question.config as ConfigureUeCauseOfDeathList).itemCount
  const causes = (question.config as ConfigureUeCauseOfDeathList).list
  const isShowValidationError = useSelector(getShowValidationErrors)
  const shouldDisplayValidationError = useSelector(getQuestionHasValidationError(question.id))

  const renderCauseOfDeathList = () => {
    if (!causes) {
      return null
    }

    if (itemCount) {
      causes.splice(itemCount)
    }

    return causes.map((cause, index) => {
      const value: ValueCauseOfDeath = (question.value as ValueCauseOfDeathList).list
        ? ((question.value as ValueCauseOfDeathList).list.find((item) => item.id === cause.id) as ValueCauseOfDeath)
        : ({ id: cause.id } as ValueCauseOfDeath)
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
    <div className="cause-of-death-list-wrapper">
      <div>
        <div className="cause-of-death-child">{renderCauseOfDeathList()}</div>
        {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>}
      </div>
    </div>
  )
}

export default UeCauseOfDeathList
