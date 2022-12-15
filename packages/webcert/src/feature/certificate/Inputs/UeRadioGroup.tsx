import {
  CertificateDataElement,
  ConfigLayout,
  ConfigUeRadioMultipleCodes,
  QuestionValidationTexts,
  RadioButton,
  ValueCode,
} from '@frontend/common'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled, { css } from 'styled-components'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../store/store'

export interface Props {
  disabled: boolean
  question: CertificateDataElement
}

interface radioButtonsProps {
  layout: ConfigLayout
}

interface radioButtonProps {
  layout: ConfigLayout
  index: number
  noItems: number
}

const RadioButtonsWrapper = styled.div<radioButtonsProps>`
  ${(props) => {
    if (props.layout === ConfigLayout.COLUMNS) {
      return css`
        display: grid;
        grid-template-columns: 1fr 1fr;
      `
    }
  }}
`

const RadioButtonWrapper = styled.div<radioButtonProps>`
  ${(props) => {
    switch (props.layout) {
      case ConfigLayout.INLINE:
        return css`
          display: inline-block;
          min-width: 100px;
        `
      case ConfigLayout.COLUMNS: {
        const column = Math.trunc((2 * props.index) / props.noItems + 1)
        const row = props.index < props.noItems / 2 ? props.index + 1 : props.index - props.noItems / 2
        return css`
          grid-column: ${column};
          grid-row: ${row};
        `
      }
    }
  }}
`

const UeRadioGroup: React.FC<Props> = ({ question, disabled }) => {
  const config = question.config as ConfigUeRadioMultipleCodes
  const radiobuttons = config.list
  const [code, setCode] = useState(question.value?.code)
  const isShowValidationError = useSelector(getShowValidationErrors)
  const shouldDisplayValidationError = useSelector(getQuestionHasValidationError(question.id))
  const dispatch = useAppDispatch()
  const shouldBeHorizontal = config.layout === ConfigLayout.ROWS && radiobuttons.length <= 2

  const noItems = radiobuttons.length

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

  return (
    radiobuttons && (
      <>
        <RadioButtonsWrapper
          layout={config.layout}
          role="radiogroup"
          className={`radio-group-wrapper ${shouldBeHorizontal ? 'ic-radio-group-horizontal' : ''}`}>
          {radiobuttons.map((radio, index) => (
            <RadioButtonWrapper key={index} layout={config.layout} index={index} noItems={noItems}>
              <RadioButton
                id={radio.id as string}
                value={radio.id}
                name={question.id}
                key={index}
                label={radio.label}
                disabled={disabled}
                checked={radio.id === code}
                hasValidationError={shouldDisplayValidationError}
                onChange={handleChange}
                wrapperAdditionalStyles={!shouldBeHorizontal && !isLastRadiobutton(index) ? 'iu-pb-400' : ''}
              />
            </RadioButtonWrapper>
          ))}
        </RadioButtonsWrapper>
        {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>}
      </>
    )
  )
}

export default UeRadioGroup
