import { debounce } from 'lodash-es'
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TextArea from '../../../../components/Inputs/TextArea'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import type {
  CertificateDataElement,
  ConfigUeTextArea,
  TextValidation,
  ValueText} from '../../../../types';
import {
  CertificateDataValidationType,
  CertificateDataValueType
} from '../../../../types'

export interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const UeTextArea: React.FC<Props> = ({ question, disabled }) => {
  const textValue = getTextValue(question)
  const questionConfig = question.config as ConfigUeTextArea
  const [text, setText] = useState(textValue != null ? textValue.text : '')
  const dispatch = useDispatch()
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))
  const textValidation = question.validation
    ? (question.validation.find((v) => v.type === CertificateDataValidationType.TEXT_VALIDATION) as TextValidation)
    : undefined

  const dispatchEditDraft = useRef(
    debounce((question: CertificateDataElement, value: string) => {
      const updatedValue = getUpdatedValue(question, value)
      dispatch(updateCertificateDataElement(updatedValue))
    }, 1000)
  ).current

  if (!textValue) {
    return <div>Value not supported!</div>
  }

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setText(event.currentTarget.value)
    dispatchEditDraft(question, event.currentTarget.value)
  }

  return (
    <>
      <>{questionConfig.label}</>
      <TextArea
        data-testid={`textarea-${question.id}`}
        disabled={disabled}
        rows={6}
        hasValidationError={validationErrors.length > 0}
        onChange={handleChange}
        name={questionConfig.id}
        value={text === null ? '' : text}
        maxLength={textValidation ? textValidation.limit : 3500}
      />
      <QuestionValidationTexts validationErrors={validationErrors} />
    </>
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
