import {
  CertificateDataElement,
  CertificateDataValidationType,
  CertificateDataValueType,
  ConfigUeTextField,
  QuestionValidationTexts,
  TextInput,
  TextValidation,
  ValueText,
} from '@frontend/common'
import _ from 'lodash'
import * as React from 'react'
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../store/certificate/certificateSelectors'

export interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const UeTextField: React.FC<Props> = ({ question, disabled }) => {
  const isShowValidationError = useSelector(getShowValidationErrors)
  const textValue = getTextValue(question)
  const questionConfig = question.config as ConfigUeTextField
  const [text, setText] = useState(textValue != null ? textValue.text : '')
  const dispatch = useDispatch()
  const questionHasValidationError = useSelector(getQuestionHasValidationError(question.id))
  const textValidation = question.validation
    ? (question.validation.find((v) => v.type === CertificateDataValidationType.TEXT_VALIDATION) as TextValidation)
    : undefined

  const dispatchEditDraft = useRef(
    _.debounce((question: CertificateDataElement, value: string) => {
      const updatedValue = getUpdatedValue(question, value)
      dispatch(updateCertificateDataElement(updatedValue))
    }, 1000)
  ).current

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setText(event.currentTarget.value)
    dispatchEditDraft(question, event.currentTarget.value)
  }

  return (
    <div className="iu-pt-200 iu-grid-cols iu-grid-cols-12">
      <TextInput
        className="iu-grid-span-6"
        disabled={disabled}
        hasValidationError={questionHasValidationError}
        onChange={handleChange}
        name={questionConfig.id}
        value={text === null ? '' : text}
        limit={textValidation ? textValidation.limit : 100}
      />
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

export default UeTextField
