import React from 'react'
import { QuestionValidationTexts } from '@frontend/common'
import { ValidationError } from '@frontend/common/src'
import { FlattenSimpleInterpolation } from 'styled-components/macro'

interface QuestionValidationTextsProps {
  validationErrors: ValidationError[]
  id: string
  defaultStyle?: FlattenSimpleInterpolation
  specificStyle?: FlattenSimpleInterpolation
  disabled?: boolean
  fieldId: string
  handleErrorStyling: (visible: boolean, id: string) => void
}

const DiagnosisValidation: React.FC<QuestionValidationTextsProps> = ({
  validationErrors,
  fieldId,
  id,
  specificStyle,
  disabled,
  defaultStyle,
  handleErrorStyling,
}) => {
  const getFilteredValidationErrors = () => {
    if (!validationErrors || validationErrors.length === 0) {
      return []
    }
    return validationErrors.filter((v) => v.field.includes(`${parseInt(id) - 1}.${fieldId}`))
  }

  const isVisible = () => {
    return filteredValidationErrors.length > 0 && !disabled
  }

  const hasTwoErrorsOnSameRow = () => {
    return validationErrors && getNbrOfNonInstantValidatingErrors() === 2
  }

  const getStyle = () => {
    return hasTwoErrorsOnSameRow() && specificStyle ? specificStyle : defaultStyle
  }

  const hasInstantValidatingError = () => {
    return (
      validationErrors && validationErrors.filter((v) => v.field.includes(`${parseInt(id) - 1}`) && v.field.includes('.row')).length > 0
    )
  }

  const getNbrOfNonInstantValidatingErrors = () => {
    return validationErrors
      ? validationErrors.filter((v) => v.field.includes(`${parseInt(id) - 1}`) && !v.field.includes('.row')).length
      : 0
  }

  const shouldShowErrorStyling = () => {
    return hasInstantValidatingError() || (!disabled && getNbrOfNonInstantValidatingErrors() > 0)
  }

  const filteredValidationErrors = getFilteredValidationErrors()

  handleErrorStyling(shouldShowErrorStyling(), id)

  if (!isVisible()) {
    return null
  }

  return <QuestionValidationTexts additionalStyles={getStyle()} validationErrors={filteredValidationErrors} />
}

export default DiagnosisValidation
