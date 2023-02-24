import {
  CertificateDataElement,
  ConfigLayout,
  ConfigUeRadioMultipleCodesOptionalDropdown,
  QuestionValidationTexts,
  RadioButton,
  ValueCode,
} from '@frontend/common'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { css, FlattenSimpleInterpolation } from 'styled-components'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../../store/store'
import Question from '../../Question/Question'
import QuestionWrapper from '../../Question/QuestionWrapper'
import { ItemWrapper } from '../ItemWrapper'

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
  const [code, setCode] = useState((question.value as ValueCode)?.code)
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

  return (
    <>
      <div
        role="radiogroup"
        className={`radio-group-wrapper ${validationErrors.length > 0 ? 'iu-mb-300' : ''} ${
          shouldBeHorizontal ? 'ic-radio-group-horizontal' : ''
        }`}>
        {radiobuttons &&
          radiobuttons.map((radio, index) => (
            <React.Fragment key={index}>
              <ItemWrapper layout={ConfigLayout.ROWS} index={index} noItems={radiobuttons.length}>
                <RadioButton
                  id={radio.id as string}
                  value={radio.id}
                  name={question.id}
                  label={radio.label}
                  disabled={disabled}
                  checked={radio.id === code}
                  hasValidationError={validationErrors.length > 0}
                  onChange={handleChange}
                />
              </ItemWrapper>

              {radio.dropdownQuestionId && (
                <QuestionWrapper additionalStyles={dropDownStyles}>
                  <Question key={radio.dropdownQuestionId} id={radio.dropdownQuestionId} />
                </QuestionWrapper>
              )}
            </React.Fragment>
          ))}
      </div>
      <QuestionValidationTexts validationErrors={validationErrors} />
    </>
  )
}

export default UeRadioGroupOptionalDropdown
