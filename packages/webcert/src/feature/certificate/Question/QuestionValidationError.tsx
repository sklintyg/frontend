import { QuestionValidationTexts } from '@frontend/common'
import { useSelector } from 'react-redux'
import { getVisibleValidationErrors } from '../../../store/certificate/certificateSelectors'
import { isEqual } from 'lodash'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

const ValidationErrorWrapper = styled.div`
  :not(:last-child) {
    margin-bottom: 1rem;
  }
`

export const QuestionValidationError = ({ id }: { id: string }): ReactElement | null => {
  const validationErrors = useSelector(getVisibleValidationErrors(id), isEqual)
  return validationErrors.length > 0 ? (
    <ValidationErrorWrapper>
      <QuestionValidationTexts validationErrors={validationErrors} />
    </ValidationErrorWrapper>
  ) : null
}
