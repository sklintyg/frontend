import { CertificateDataElement, ConfigLayout, ConfigUeCheckboxMultipleCodes, QuestionValidationTexts } from '@frontend/common'
import React from 'react'
import { useSelector } from 'react-redux'
import styled, { css } from 'styled-components'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../store/certificate/certificateSelectors'
import UeCheckbox from './UeCheckbox'

export interface Props {
  disabled: boolean
  question: CertificateDataElement
}

interface checkboxesProps {
  layout: ConfigLayout
}

interface checkboxProps {
  layout: ConfigLayout
  column: number
}

const CheckboxesWrapper = styled.div<checkboxesProps>`
  ${(props) => {
    if (props.layout === ConfigLayout.COLUMNS) {
      return css`
        display: flex;
        flex-direction: column;
      `
    }
  }}
`

const CheckboxWrapper = styled.div<checkboxProps>`
  ${(props) => {
    switch (props.layout) {
      case ConfigLayout.INLINE:
        return css`
          display: inline-block;
          min-width: 100px;
        `
      case ConfigLayout.COLUMNS:
        return css`
          width: 50%;
        `
    }
  }}
`

const UeCheckboxGroup: React.FC<Props> = ({ question, disabled }) => {
  const checkboxes = (question.config as ConfigUeCheckboxMultipleCodes).list
  const isShowValidationError = useSelector(getShowValidationErrors)
  const shouldDisplayValidationError = useSelector(getQuestionHasValidationError(question.id))
  const config = question.config as ConfigUeCheckboxMultipleCodes

  const noItems = checkboxes.length

  const additionalStyles = `${() => {
    switch (config.layout) {
      case ConfigLayout.INLINE:
        return 'min-width:100px'
      case ConfigLayout.COLUMNS:
        return ' width:50%;'
      default:
        return ''
    }
  }}`

  return (
    checkboxes && (
      <div className="checkbox-group-wrapper">
        <CheckboxesWrapper layout={config.layout}>
          <div className="checkbox-child">
            {checkboxes.map((checkbox, index) => (
              <CheckboxWrapper key={index} layout={config.layout} column={Math.trunc((2 * index) / noItems + 1)}>
                <UeCheckbox
                  id={checkbox.id}
                  label={checkbox.label}
                  disabled={disabled || checkbox.disabled}
                  hasValidationError={shouldDisplayValidationError}
                  question={question}
                  wrapperAdditionalStyles={`${index !== 0 ? 'iu-pt-400' : ''}${additionalStyles}`}
                />
              </CheckboxWrapper>
            ))}
          </div>
          {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>}
        </CheckboxesWrapper>
      </div>
    )
  )
}

export default UeCheckboxGroup
