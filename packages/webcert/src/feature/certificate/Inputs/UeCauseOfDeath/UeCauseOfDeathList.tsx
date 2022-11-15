import {
  CertificateDataElement,
  ConfigureUeCauseOfDeathList,
  QuestionValidationTexts,
  ValueCauseOfDeath,
  ValueCauseOfDeathList,
} from '@frontend/common'
import React from 'react'
import { useSelector } from 'react-redux'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../../store/certificate/certificateSelectors'
import UeCauseOfDeathControl from './UeCauseOfDeathControl'

export interface Props {
  disabled: boolean
  question: CertificateDataElement
}

const UeCauseOfDeathList: React.FC<Props> = ({ question, disabled }) => {
  const questionConfig = question.config
  const questionValue = question.value
  const causes = (questionConfig as ConfigureUeCauseOfDeathList).list
  const isShowValidationError = useSelector(getShowValidationErrors)
  const shouldDisplayValidationError = useSelector(getQuestionHasValidationError(question.id))

  return (
    <div>
      <div>
        {causes &&
          causes.map((cause, index) => {
            const value: ValueCauseOfDeath = (questionValue as ValueCauseOfDeathList).list
              ? ((questionValue as ValueCauseOfDeathList).list.find((item) => item.id === cause.id) as ValueCauseOfDeath)
              : ({ id: cause.id } as ValueCauseOfDeath)

            return (
              <UeCauseOfDeathControl
                config={cause}
                value={value}
                key={index}
                disabled={disabled}
                hasValidationError={shouldDisplayValidationError}
                question={question}
              />
            )
          })}
      </div>
      {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>}
    </div>
  )
}

export default UeCauseOfDeathList
