import { debounce } from 'lodash-es'
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Typeahead, { Suggestion } from '../../../../components/Inputs/Typeahead'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import {
  CertificateDataElement,
  CertificateDataValidationType,
  CertificateDataValueType,
  ConfigUeTypeahead,
  TextValidation,
  ValueText,
} from '../../../../types'
import { GetFilteredSuggestions } from '../../../../utils'

export interface Props {
  question: CertificateDataElement
  disabled?: boolean
}

const UeTypeahead: React.FC<Props> = ({ question, disabled }) => {
  const questionConfig = question.config as ConfigUeTypeahead
  const textValue = getTextValue(question)
  const [text, setText] = useState(textValue != null ? textValue.text : '')
  const [suggestions, setSuggestions] = useState([] as string[])
  const dispatch = useDispatch()
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))
  const textValidation = question.validation
    ? (question.validation.find((v) => v.type === CertificateDataValidationType.TEXT_VALIDATION) as TextValidation)
    : undefined

  const dispatchEditDraft = useRef(
    debounce((question: CertificateDataElement, value: string) => {
      const oldValue = question.value as ValueText
      if (value !== oldValue.text) {
        const updatedValue = getUpdatedValue(question, value)
        dispatch(updateCertificateDataElement(updatedValue))
      }
    }, 2000)
  ).current

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const newText = event.currentTarget.value

    if (newText !== text) {
      setText(newText)

      dispatchEditDraft(question, newText)

      if (newText === undefined || newText === null) {
        return []
      }

      const result = GetFilteredSuggestions(questionConfig.typeAhead, newText)
      setSuggestions(result)
    }
  }

  const getSuggestions = (): Suggestion[] => {
    return suggestions.map((suggestion) => {
      return {
        label: suggestion,
        disabled: false,
        title: suggestion,
      }
    })
  }

  const onSuggestionSelected = (value: string) => {
    if (value !== text) {
      setText(value)
      dispatchEditDraft(question, value)
    }
  }

  return (
    <div className="iu-grid-cols iu-grid-cols-12">
      <div className="iu-grid-span-6">
        <Typeahead
          data-testid={`typeahead-${question.id}`}
          disabled={disabled}
          hasValidationError={validationErrors.length > 0}
          onChange={handleChange}
          value={text === null ? '' : text}
          limit={textValidation ? textValidation.limit : 100}
          placeholder={questionConfig.placeholder}
          suggestions={getSuggestions()}
          onSuggestionSelected={onSuggestionSelected}
        />
        <QuestionValidationTexts validationErrors={validationErrors} />
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

export default UeTypeahead
