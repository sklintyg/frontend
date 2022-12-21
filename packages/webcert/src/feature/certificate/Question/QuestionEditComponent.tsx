import React, { useCallback } from 'react'
import { CertificateDataElement, validateExpression, ValueType } from '@frontend/common'
import QuestionAccordion from './QuestionAccordion'
import QuestionUeResolve from './QuestionUeResolve'

interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const QuestionEditComponent: React.FC<Props> = ({ question, disabled }) => {
  const isAccordionOpen = useCallback(
    () => (question.value != null ? validateExpression(`'${question.value.id}'`, question.value as ValueType) : false),
    [question.value]
  )

  if (question.config.accordion) {
    return (
      <div id={question.id}>
        <QuestionAccordion accordion={question.config.accordion} icon={question.config.icon} open={isAccordionOpen()}>
          <QuestionUeResolve question={question} disabled={disabled} />
        </QuestionAccordion>
      </div>
    )
  }
  return <QuestionUeResolve question={question} disabled={disabled} />
}

export default QuestionEditComponent
