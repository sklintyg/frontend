import React from 'react'
import { ValidationError } from '../..'
import { Typography } from '@material-ui/core'
import useTheme from '@material-ui/core/styles/useTheme'

interface QuestionValidationTextsProps {
  validationErrors: ValidationError[]
}

const QuestionValidationTexts: React.FC<QuestionValidationTextsProps> = ({ validationErrors }) => {
  const theme = useTheme()

  return (
    <>
      {validationErrors &&
        validationErrors.length > 0 &&
        validationErrors.map((validationError, index) => (
          <Typography key={index} variant="body1" style={{ color: theme.palette.error.main }}>
            {validationError.text}
          </Typography>
        ))}
    </>
  )
}

export default QuestionValidationTexts
