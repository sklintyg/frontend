import { QuestionValidationTexts } from '@frontend/common'
import { useSelector } from 'react-redux'
import { getVisibleValidationErrors } from '../../../store/certificate/certificateSelectors'
import { isEqual } from 'lodash'
import React, { ReactElement } from 'react'
import styled from 'styled-components/macro'

const ValidationErrorWrapper = styled.div`
  padding: 0 2rem;
`
export const QuestionValidationError = ({ id }: { id: string }): ReactElement => {
  const validationErrors = useSelector(getVisibleValidationErrors(id), isEqual)
  return validationErrors.length > 0 ? (
    <ValidationErrorWrapper>
      <QuestionValidationTexts validationErrors={validationErrors} />
    </ValidationErrorWrapper>
  ) : (
    <></>
  )
}
