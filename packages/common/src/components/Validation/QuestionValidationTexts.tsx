import React from 'react'
import { CertificateDataElement, ValidationError } from '../..'
import { Typography } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { getShowValidationErrors } from '@frontend/webcert/src/store/selectors/certificate'
import useTheme from '@material-ui/core/styles/useTheme'

export interface QuestionValidationTextsProps {
  validationErrors: ValidationError[]
}

const QuestionValidationTexts: React.FC<QuestionValidationTextsProps> = ({ validationErrors }) => {
  const isShowValidationError = useSelector(getShowValidationErrors)
  const theme = useTheme()

  return (
    <>
      {isShowValidationError &&
        validationErrors &&
        validationErrors.length > 0 &&
        validationErrors.map((validationError, index) => (
          <Typography key={index} variant="body1" style={{ color: theme.palette.warning.main }}>
            {validationError.text}
          </Typography>
        ))}
    </>
  )
}

export default QuestionValidationTexts
