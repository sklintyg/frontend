import type React from 'react';
import { useCallback } from 'react'
import type { CertificateDataElement, ValueType } from '../../../types'
import { validateExpression } from '../../../utils/validation/validateExpression'
import QuestionAccordion from './QuestionAccordion'
import { QuestionUeResolve } from './QuestionUeResolve'

interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const QuestionEditComponent: React.FC<Props> = ({ question, disabled }) => {
  const isAccordionOpen = useCallback(
    (value: { id?: string } & ValueType) => (value.id != null ? validateExpression(`'${value.id}'`, value) : false),
    []
  )

  if (question.config.accordion) {
    return (
      <div id={question.id}>
        <QuestionAccordion
          accordion={question.config.accordion}
          icon={question.config.icon}
          open={question.value != null && isAccordionOpen(question.value)}
        >
          <QuestionUeResolve question={question} disabled={disabled} />
        </QuestionAccordion>
      </div>
    )
  }
  return <QuestionUeResolve question={question} disabled={disabled} />
}

export default QuestionEditComponent
