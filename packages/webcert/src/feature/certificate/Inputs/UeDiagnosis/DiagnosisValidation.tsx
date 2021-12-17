import React from 'react'
import { QuestionValidationTexts } from '@frontend/common'
import { ValidationError } from '@frontend/common/src'
import { FlattenSimpleInterpolation } from 'styled-components/macro'

interface QuestionValidationTextsProps {
  validationErrors: ValidationError[]
  id: string
  defaultStyle: FlattenSimpleInterpolation
  specificStyle?: FlattenSimpleInterpolation
  disabled?: boolean
  fieldId: string
  addIdToErrorStylingList: (visible: boolean, id: string) => void
}

const DiagnosisValidation: React.FC<QuestionValidationTextsProps> = ({
  validationErrors,
  fieldId,
  id,
  specificStyle,
  disabled,
  defaultStyle,
  addIdToErrorStylingList,
}) => {
  const getFilteredValidationErrors = () => {
    if (!validationErrors || validationErrors.length === 0) {
      return []
    }
    return validationErrors.filter((v) => v.field.includes(`[${parseInt(id) - 1}].${fieldId}`))
  }

  const isVisible = () => {
    return filteredValidationErrors.length > 0 && !disabled
  }

  const hasTwoErrorsOnSameRow = () => {
    return (
      validationErrors &&
      validationErrors.filter((v) => v.field.includes(`[${parseInt(id) - 1}]`) && !v.field.includes('.row')).length === 2
    )
  }

  const getStyle = () => {
    return hasTwoErrorsOnSameRow() && specificStyle ? specificStyle : defaultStyle
  }

  const filteredValidationErrors = getFilteredValidationErrors()

  if (!isVisible()) {
    return null
  }
  addIdToErrorStylingList(isVisible(), id)

  return <QuestionValidationTexts additionalStyles={getStyle()} validationErrors={filteredValidationErrors} />
}

export default DiagnosisValidation
