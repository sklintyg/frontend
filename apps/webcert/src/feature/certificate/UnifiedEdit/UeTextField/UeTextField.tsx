import { debounce } from 'lodash-es'
import { useEffect, useRef, useState } from 'react'
import TextInput from '../../../../components/Inputs/TextInput'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import type { CertificateDataElement, ConfigUeTextField, TextValidation, ValueText } from '../../../../types'
import { CertificateDataValidationType, CertificateDataValueType } from '../../../../types'
import InvalidCharactersInfoBox from '../InvalidCharactersInfoBox'
import useIso8859Sanitization from '../hooks/useIso8859Sanitization'

interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const UeTextField = ({ question, disabled }: Props) => {
  const textValue = getTextValue(question)
  const questionConfig = question.config as ConfigUeTextField
  const rawInitialText = textValue?.text ?? ''
  const dispatch = useAppDispatch()
  const validationErrors = useAppSelector(getVisibleValidationErrors(question.id))
  const textValidation = question.validation
    ? (question.validation.find((v) => v.type === CertificateDataValidationType.TEXT_VALIDATION) as TextValidation)
    : undefined
  const { sanitize, showWarning, sanitizedInitialValue } = useIso8859Sanitization(rawInitialText)
  const [text, setText] = useState(sanitizedInitialValue)

  useEffect(() => {
    if (!disabled && sanitizedInitialValue !== rawInitialText) {
      dispatch(updateCertificateDataElement(getUpdatedValue(question, sanitizedInitialValue)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dispatchEditDraft = useRef(
    debounce((question: CertificateDataElement, value: string) => {
      const updatedValue = getUpdatedValue(question, value)
      dispatch(updateCertificateDataElement(updatedValue))
    }, 1000)
  ).current

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const sanitized = sanitize(event.currentTarget.value)
    setText(sanitized)
    dispatchEditDraft(question, sanitized)
  }

  return (
    <div className="iu-grid-cols-12">
      <div className="iu-grid-span-6">
        <TextInput
          className=""
          data-testid={`textfield-${question.id}`}
          disabled={disabled}
          hasValidationError={validationErrors.length > 0}
          onChange={handleChange}
          name={questionConfig.id}
          value={text === null ? '' : text}
          limit={textValidation ? textValidation.limit : 100}
        />
        <QuestionValidationTexts validationErrors={validationErrors} />
      </div>
      <div className="iu-grid-span-12">
        <InvalidCharactersInfoBox visible={showWarning} />
      </div>
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
