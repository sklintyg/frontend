import * as React from 'react'
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import { CertificateDataElement, CertificateDataValueType, ValueText } from '@frontend/common'
import { QuestionValidationTexts, TextArea } from '@frontend/common'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../store/certificate/certificateSelectors'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { ConfigUeTextArea } from './../../../../../common/src/types/certificate'

interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const UeTextArea: React.FC<Props> = ({ question, disabled }) => {
  const isShowValidationError = useSelector(getShowValidationErrors)
  const textValue = getTextValue(question)
  const questionConfig = question.config as ConfigUeTextArea
  const [text, setText] = useState(textValue != null ? textValue.text : '')
  const dispatch = useDispatch()
  const questionHasValidationError = useSelector(getQuestionHasValidationError(question.id))

  const dispatchEditDraft = useRef(
    _.debounce((value: string) => {
      const updatedValue = getUpdatedValue(question, value)
      dispatch(updateCertificateDataElement(updatedValue))
    }, 1000)
  ).current

  if (!textValue) {
    return <div className={`iu-pt-200`}>Value not supported!</div>
  }

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setText(event.currentTarget.value)
    dispatchEditDraft(event.currentTarget.value)
  }

  return (
    <div className={`iu-pt-200`}>
      <TextArea
        disabled={disabled}
        rowsMin={4}
        hasValidationError={questionHasValidationError}
        onChange={handleChange}
        name={questionConfig.id}
        value={text === null ? '' : text}></TextArea>
      {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>}
    </div>
  )
}

function getTextValue(question: CertificateDataElement): ValueText | null {
  if (question.value?.type !== CertificateDataValueType.TEXT) {
    return null
  }
  return question.value as ValueText
}

function getUpdatedValue(question: CertificateDataElement, text: string): CertificateDataElement {
  const updatedQuestion: CertificateDataElement = { ...question }
  updatedQuestion.value = { ...(updatedQuestion.value as ValueText) }
  ;(updatedQuestion.value as ValueText).text = text
  return updatedQuestion
}

export default UeTextArea
