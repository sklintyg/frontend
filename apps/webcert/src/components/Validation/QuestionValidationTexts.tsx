import React from 'react'
import { FlattenSimpleInterpolation } from 'styled-components'
import { ValidationError } from '../../types'
import ValidationText from './ValidationText'

interface QuestionValidationTextsProps {
  validationErrors: ValidationError[]
  additionalStyles?: FlattenSimpleInterpolation
}

const QuestionValidationTexts: React.FC<QuestionValidationTextsProps> = ({ validationErrors, additionalStyles }) => {
  return validationErrors && validationErrors.length > 0 ? (
    <div css={additionalStyles}>
      {validationErrors.map((validationError, index) => (
        <ValidationText key={index} id={validationError.id} message={validationError.text} />
      ))}
    </div>
  ) : null
}

export default QuestionValidationTexts
