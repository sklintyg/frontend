import React, { useState } from 'react'
import {
  CertificateDataElement,
  ConfigUeRadioMultipleCodesOptionalDropdown,
  QuestionValidationTexts,
  RadioButton,
  ValueCode,
} from '@frontend/common'
import { useSelector } from 'react-redux'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../../store/store'
import Question from '../../Question/Question'
import { css, FlattenSimpleInterpolation } from 'styled-components/macro'
import QuestionWrapper from '../../Question/QuestionWrapper'

const dropDownStyles: FlattenSimpleInterpolation = css`
  padding: 0 !important;
  padding-bottom: 0.9375rem !important;
`

interface Props {
  disabled: boolean
  question: CertificateDataElement
}

const UeRadioGroupOptionalDropdown: React.FC<Props> = ({ question, disabled }) => {
  const radiobuttons = (question.config as ConfigUeRadioMultipleCodesOptionalDropdown).list
  const [code, setCode] = useState(question.value?.code)
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))
  const dispatch = useAppDispatch()
  const shouldBeHorizontal = radiobuttons.length <= 2

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setCode(event.currentTarget.value)
    const updatedValue = getUpdatedValue(question, event.currentTarget.value)
    dispatch(updateCertificateDataElement(updatedValue))
  }

  const getUpdatedValue = (question: CertificateDataElement, selected: string) => {
    const updatedQuestion: CertificateDataElement = { ...question }

    const updatedQuestionValue = { ...(updatedQuestion.value as ValueCode) }
    updatedQuestionValue.id = selected
    updatedQuestionValue.code = selected
    updatedQuestion.value = updatedQuestionValue

    return updatedQuestion
  }

  function isLastRadiobutton(index: number) {
    return index === radiobuttons.length - 1
  }

  const renderRadioButtons = () => {
    if (!radiobuttons) {
      return null
    }
    return radiobuttons.map((radio, index) => (
      <React.Fragment key={index}>
        <RadioButton
          id={radio.id as string}
          value={radio.id}
          name={question.id}
          label={radio.label}
          disabled={disabled}
          checked={radio.id === code}
          hasValidationError={validationErrors.length > 0}
          onChange={handleChange}
          wrapperAdditionalStyles={
            !shouldBeHorizontal && !isLastRadiobutton(index) && !radio.dropdownQuestionId ? 'iu-pb-400 radio-dropdown' : 'radio-dropdown'
          }
        />
        {radio.dropdownQuestionId && (
          <QuestionWrapper additionalStyles={dropDownStyles}>
            <Question key={radio.dropdownQuestionId} id={radio.dropdownQuestionId} />
          </QuestionWrapper>
        )}
      </React.Fragment>
    ))
  }

  return (
    <div role="radiogroup" className={`radio-group-wrapper ${shouldBeHorizontal ? 'ic-radio-group-horizontal' : ''}`}>
      {renderRadioButtons()}
      <QuestionValidationTexts validationErrors={validationErrors} />
    </div>
  )
}

export default UeRadioGroupOptionalDropdown
