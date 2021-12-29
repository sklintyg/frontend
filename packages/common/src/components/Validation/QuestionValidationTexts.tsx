import React from 'react'
import { ValidationError } from '../..'
import ValidationText from './ValidationText'
import { FlattenSimpleInterpolation } from 'styled-components/macro'

interface QuestionValidationTextsProps {
  validationErrors: ValidationError[]
  additionalStyles?: FlattenSimpleInterpolation
}

const QuestionValidationTexts: React.FC<QuestionValidationTextsProps> = ({ validationErrors, additionalStyles }) => {
  return (
    <div css={additionalStyles}>
      {validationErrors &&
        validationErrors.length > 0 &&
        validationErrors.map((validationError, index) => (
          <ValidationText key={index} id={validationError.id} message={validationError.text} />
        ))}
    </div>
  )
}

export default QuestionValidationTexts
