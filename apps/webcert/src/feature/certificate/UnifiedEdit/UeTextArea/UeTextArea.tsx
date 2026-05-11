import { debounce } from 'lodash-es'
import { useRef, useState } from 'react'
import TextArea from '../../../../components/Inputs/TextArea'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import type { CertificateDataElement, ConfigUeTextArea, TextValidation, ValueText } from '../../../../types'
import { CertificateDataValidationType, CertificateDataValueType } from '../../../../types'
import InvalidCharactersInfoBox from '../InvalidCharactersInfoBox'
import useIso8859Sanitization from '../hooks/useIso8859Sanitization'

interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const UeTextArea = ({ question, disabled }: Props) => {
  const textValue = getTextValue(question)
  const questionConfig = question.config as ConfigUeTextArea
  const [text, setText] = useState(textValue != null ? textValue.text : '')
  const dispatch = useAppDispatch()
  const validationErrors = useAppSelector(getVisibleValidationErrors(question.id))
  const textValidation = question.validation
    ? (question.validation.find((v) => v.type === CertificateDataValidationType.TEXT_VALIDATION) as TextValidation)
    : undefined
  const { sanitize, resetWarning, showWarning } = useIso8859Sanitization()

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
    const value = event.currentTarget.value
    if (value === '') {
      resetWarning()
    }
    setText(value)
    dispatchEditDraft(question, value)
  }

  const handleBlur = () => {
    const sanitized = sanitize(text ?? '')
    setText(sanitized)
    dispatchEditDraft(question, sanitized)
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
        onBlur={handleBlur}
        name={questionConfig.id}
        value={text === null ? '' : text}
        maxLength={textValidation ? textValidation.limit : 3500}
      />
      <InvalidCharactersInfoBox visible={showWarning} />
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
