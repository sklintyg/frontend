import React from 'react'
import { ValidationError } from '../..'
import ValidationText from './ValidationText'
import { FlattenSimpleInterpolation } from 'styled-components/macro'

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
