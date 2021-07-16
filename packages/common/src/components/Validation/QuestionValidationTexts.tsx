import React from 'react'
import { ValidationError } from '../..'
import ValidationText from './ValidationText'

interface QuestionValidationTextsProps {
  validationErrors: ValidationError[]
}

const QuestionValidationTexts: React.FC<QuestionValidationTextsProps> = ({ validationErrors }) => {
  return (
    <>
      {validationErrors &&
        validationErrors.length > 0 &&
        validationErrors.map((validationError, index) => (
          <ValidationText key={index} id={validationError.id} message={validationError.text} />
        ))}
    </>
  )
}

export default QuestionValidationTexts
