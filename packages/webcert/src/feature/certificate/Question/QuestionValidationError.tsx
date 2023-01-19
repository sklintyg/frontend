import { QuestionValidationTexts } from '@frontend/common'
import { useSelector } from 'react-redux'
import { getVisibleValidationErrors } from '../../../store/certificate/certificateSelectors'
import { isEqual } from 'lodash'
import React, { ReactElement } from 'react'

export const QuestionValidationError = ({ id }: { id: string }): ReactElement => {
  const validationErrors = useSelector(getVisibleValidationErrors(id), isEqual)
  return <QuestionValidationTexts validationErrors={validationErrors} />
}
