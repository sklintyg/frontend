import type React from 'react'
import { useCallback, useEffect } from 'react'
import { clearClientValidationErrors } from '../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../store/store'
import type { CertificateDataElement, ValueType } from '../../../types'
import { validateExpression } from '../../../utils/validation/validateExpression'
import QuestionAccordion from './QuestionAccordion'
import { QuestionUeResolve } from './QuestionUeResolve'

interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const QuestionEditComponent = ({ question, disabled }: Props) => {
  const dispatch = useAppDispatch()
  const isAccordionOpen = useCallback(
    (value: { id?: string } & ValueType) => (value.id != null ? validateExpression(`'${value.id}'`, value) : false),
    []
  )

  useEffect(
    () => () => {
      // Clear client validation errors on removal
      dispatch(clearClientValidationErrors(question.id))
    },
    [dispatch, question.id]
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
