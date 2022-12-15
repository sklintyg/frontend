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
  index: number
  noItems: number
}

const CheckboxesWrapper = styled.div<checkboxesProps>`
  ${(props) => {
    if (props.layout === ConfigLayout.COLUMNS) {
      return css`
        display: grid;
        grid-template-columns: 1fr 1fr;
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

const UeCheckboxGroup: React.FC<Props> = ({ question, disabled }) => {
  const config = question.config as ConfigUeCheckboxMultipleCodes
  const checkboxes = config.list
  const isShowValidationError = useSelector(getShowValidationErrors)
  const shouldDisplayValidationError = useSelector(getQuestionHasValidationError(question.id))

  const noItems = checkboxes.length

  return (
    checkboxes && (
      <div className="checkbox-group-wrapper">
        <CheckboxesWrapper layout={config.layout}>
          {checkboxes.map((checkbox, index) => (
            <CheckboxWrapper key={index} layout={config.layout} index={index} noItems={noItems}>
              <UeCheckbox
                id={checkbox.id}
                label={checkbox.label}
                disabled={disabled || checkbox.disabled}
                hasValidationError={shouldDisplayValidationError}
                question={question}
                wrapperAdditionalStyles={`${config.layout === ConfigLayout.ROWS && index === 0 ? '' : 'iu-pt-400'} `}
              />
            </CheckboxWrapper>
          ))}

          {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>}
        </CheckboxesWrapper>
      </div>
    )
  )
}

export default UeCheckboxGroup
