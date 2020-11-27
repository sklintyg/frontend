import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { ValueBoolean, CertificateDataElement, CertificateDataValueType, ValueText } from '@frontend/common'
import grey from '@material-ui/core/colors/grey'
import { Typography } from '@material-ui/core'
import { ConfigUeRadioBoolean } from '../../types/certificate'

const useStyles = makeStyles((theme) => ({
  root: {
    whiteSpace: 'pre-wrap',
    background: grey[300],
    display: 'inline-block',
    borderRadius: theme.shape.borderRadius,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  uvText: {
    fontSize: theme.typography.subtitle2.fontSize,
  },
}))

interface UvTextProps {
  question: CertificateDataElement
}

const UvText: React.FC<UvTextProps> = ({ question }) => {
  const classes = useStyles()
  const questionConfig = question.config as ConfigUeRadioBoolean
  let displayText = 'Ej angivet'

  switch (question.value!.type) {
    case CertificateDataValueType.BOOLEAN:
      const booleanValue = question.value as ValueBoolean
      if (booleanValue.selected !== null && question.visible) {
        displayText = booleanValue.selected ? questionConfig.selectedText : questionConfig.unselectedText
      }
      break
    case CertificateDataValueType.TEXT:
      const textValue = question.value as ValueText
      if (textValue.text != null && textValue.text.length > 0) {
        displayText = textValue.text
      }
      break
    default:
      displayText = 'Okänd datatyp'
      break
  }

  return (
    <div className={classes.root}>
      <Typography className={classes.uvText}>{displayText}</Typography>
    </div>
  )
}

export default UvText
