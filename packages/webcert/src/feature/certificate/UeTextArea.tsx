import * as React from 'react'
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import { makeStyles } from '@material-ui/core/styles'
import { CertificateDataElement, CertificateTextValue } from '@frontend/common'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../store/selectors/certificate'
import { updateCertificateDataElement } from '../../store/actions/certificates'
import { QuestionValidationTexts, TextArea } from '@frontend/common/src'

const useStyles = makeStyles((theme) => ({
  root: {
    borderBottomRightRadius: '8px',
    borderBottomLeftRadius: '8px',
    paddingTop: theme.spacing(1.5),
  },
  textarea: {
    width: '-webkit-fill-available',
  },
  heading: {
    fontWeight: 'bold',
  },
}))

interface UeTextAreaProps {
  question: CertificateDataElement
}

const UeTextArea: React.FC<UeTextAreaProps> = ({ question }) => {
  const textValue = getTextValue(question)
  const [text, setText] = useState(textValue != null ? textValue.text : '')
  const dispatch = useDispatch()
  const shouldDisplayValidationError = useSelector(getQuestionHasValidationError(question.id))

  const classes = useStyles()

  const dispatchEditDraft = useRef(
    _.debounce((value: string) => {
      const updatedValue = getUpdatedValue(question, value)
      dispatch(updateCertificateDataElement(updatedValue))
    }, 1000)
  ).current

  if (!textValue) {
    return <div className={classes.root}>Value not supported!</div>
  }

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setText(event.currentTarget.value)
    dispatchEditDraft(event.currentTarget.value)
  }

  return (
    <div className={classes.root}>
      <TextArea
        rowsMin={4}
        hasValidationError={shouldDisplayValidationError}
        additionalStyles={classes.textarea}
        onChange={handleChange}
        name={question.config.prop}
        value={text}></TextArea>
      <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>
    </div>
  )
}

function getTextValue(question: CertificateDataElement): CertificateTextValue | null {
  if (question.value.type !== 'TEXT') {
    return null
  }
  return question.value as CertificateTextValue
}

function getUpdatedValue(question: CertificateDataElement, text: string): CertificateDataElement {
  const updatedQuestion: CertificateDataElement = { ...question }
  updatedQuestion.value = { ...updatedQuestion.value }
  ;(updatedQuestion.value as CertificateTextValue).text = text
  return updatedQuestion
}

// {isShowValidationError && question.validationError.length > 0 && question.validationError.map(validationError => <Typography variant="body1" color="error">{validationError.text}</Typography>)}
export default UeTextArea
