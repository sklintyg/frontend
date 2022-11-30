import React from 'react'
import { useSelector } from 'react-redux'
import { getShowValidationErrors, getVisibleValidationErrors } from '../../../store/certificate/certificateSelectors'
import { QuestionValidationTexts } from '@frontend/common'
import styled from 'styled-components'

export const ValidationWrapper = styled.div`
  flex-basis: 100%;
`

interface Props {
  questionId: string
  fieldId?: string
}

const QuestionValidation: React.FC<Props> = ({ questionId, fieldId }) => {
  const isShowValidationError = useSelector(getShowValidationErrors)
  const validationErrors = useSelector(getVisibleValidationErrors(questionId, fieldId))

  return isShowValidationError ? (
    <ValidationWrapper>
      <QuestionValidationTexts validationErrors={validationErrors} />
    </ValidationWrapper>
  ) : null
}

export default QuestionValidation
