import React from 'react'
import { FlattenSimpleInterpolation } from 'styled-components/macro'
import { ValidationError } from '../../types'
import ValidationText from './ValidationText'

interface QuestionValidationTextsProps {
  validationErrors: ValidationError[]
  additionalStyles?: FlattenSimpleInterpolation
  spacing?: boolean
}

const QuestionValidationTexts: React.FC<QuestionValidationTextsProps> = ({ validationErrors, additionalStyles, spacing }) => {
  return validationErrors && validationErrors.length > 0 ? (
    <div css={additionalStyles} className={`${spacing ? 'iu-mt-300' : 'iu-mt-100'}`}>
      {validationErrors.map((validationError, index) => (
        <ValidationText key={index} id={validationError.id} message={validationError.text} />
      ))}
    </div>
  ) : null
}

export default QuestionValidationTexts
