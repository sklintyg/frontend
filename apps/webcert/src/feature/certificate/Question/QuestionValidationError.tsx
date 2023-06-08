import { QuestionValidationTexts } from '@frontend/common'
import { isEqual } from 'lodash'
import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
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
