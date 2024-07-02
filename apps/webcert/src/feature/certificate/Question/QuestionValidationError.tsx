import { isEqual } from 'lodash-es'
import type { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import QuestionValidationTexts from '../../../components/Validation/QuestionValidationTexts'
import { getVisibleValidationErrors } from '../../../store/certificate/certificateSelectors'

const ValidationErrorWrapper = styled.div`
  :not(:last-child) {
    padding-bottom: 0.9375rem;
  }
`

export const QuestionValidationError = ({ id }: { id: string }): ReactElement | null => {
  const validationErrors = useSelector(getVisibleValidationErrors(id), isEqual)
  return validationErrors.length > 0 ? (
    <ValidationErrorWrapper className="contentPaperWrapper">
      <QuestionValidationTexts validationErrors={validationErrors} />
    </ValidationErrorWrapper>
  ) : null
}
