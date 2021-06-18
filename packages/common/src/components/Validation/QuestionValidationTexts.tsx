import React from 'react'
import { ValidationError } from '../..'

interface QuestionValidationTextsProps {
  validationErrors: ValidationError[]
}

const QuestionValidationTexts: React.FC<QuestionValidationTextsProps> = ({ validationErrors }) => {
  return (
    <>
      {validationErrors &&
        validationErrors.length > 0 &&
        validationErrors.map((validationError, index) => (
          <p key={index} aria-live="polite" id={validationError.id} className="ic-forms__error-message">
            {validationError.text}
          </p>
        ))}
    </>
  )
}

export default QuestionValidationTexts
