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
          <p key={index} className="iu-fs-200 iu-color-error">
            {validationError.text}
          </p>
        ))}
    </>
  )
}

export default QuestionValidationTexts
