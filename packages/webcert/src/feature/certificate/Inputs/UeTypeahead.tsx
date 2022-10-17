import {
  CertificateDataElement,
  CertificateDataValidationType,
  ConfigUeTypeahead,
  QuestionValidationTexts,
  TextValidation,
  ValueText,
} from '@frontend/common'
import _ from 'lodash'
import * as React from 'react'
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../store/certificate/certificateSelectors'
import Typeahead, { Suggestion } from '@frontend/common/src/components/Inputs/Typeahead'

import { css } from 'styled-components'

export interface Props {
  question: CertificateDataElement
  disabled?: boolean
}

const wholeRowGrid = css`
  position: relative;
`

const UeTypeahead: React.FC<Props> = ({ question, disabled }) => {
  const isShowValidationError = useSelector(getShowValidationErrors)
  const questionConfig = question.config as ConfigUeTypeahead
  const [text, setText] = useState((question.value as ValueText).text)
  const [open, setOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([] as string[])
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

  const handleClose = () => {
    setOpen(false)
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const newText = event.currentTarget.value
    setText(newText)

    setOpen(true)
    dispatchEditDraft(question, newText)

    if (newText === undefined || newText === null) {
      return []
    }

    if (newText.length === 0) {
      setOpen(false)
    }
    setSuggestions(questionConfig.typeahead.filter((suggestion: string) => suggestion.toLowerCase().indexOf(newText.toLowerCase()) >= 0))
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
    setText(value)
    setOpen(false)
    dispatchEditDraft(question, value)
  }

  return (
    <div className="iu-pt-200 iu-grid-cols iu-grid-cols-12">
      <div className="iu-grid-span-6">
        <Typeahead
          disabled={disabled}
          hasValidationError={questionHasValidationError}
          onChange={handleChange}
          value={text === null ? '' : text}
          limit={textValidation ? textValidation.limit : 100}
          suggestions={getSuggestions()}
          onSuggestionSelected={onSuggestionSelected}
          open={open}
          onClose={handleClose}
          listStyles={wholeRowGrid}
        />
        {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>}
      </div>
    </div>
  )
}

function getUpdatedValue(question: CertificateDataElement, text: string): CertificateDataElement {
  const updatedQuestion: CertificateDataElement = { ...question }
  updatedQuestion.value = { ...(updatedQuestion.value as ValueText) }
  ;(updatedQuestion.value as ValueText).text = text
  return updatedQuestion
}

export default UeTypeahead
