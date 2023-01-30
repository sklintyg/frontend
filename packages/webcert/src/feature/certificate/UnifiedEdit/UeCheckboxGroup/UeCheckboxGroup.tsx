import { CertificateDataElement, ConfigLayout, ConfigUeCheckboxMultipleCodes, QuestionValidationTexts } from '@frontend/common'
import React from 'react'
import { useSelector } from 'react-redux'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { GroupWrapper } from '../GroupWrappers'
import { ItemWrapper } from '../ItemWrapper'
import UeCheckbox from '../UeCheckbox/UeCheckbox'

export interface Props {
  disabled: boolean
  question: CertificateDataElement
}

const UeCheckboxGroup: React.FC<Props> = ({ question, disabled }) => {
  const config = question.config as ConfigUeCheckboxMultipleCodes
  const checkboxes = config.list
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))

  const noItems = checkboxes.length

  function shouldHaveItemPadding(index: number) {
    return (config.layout === ConfigLayout.ROWS || config.layout === ConfigLayout.COLUMN) && index < checkboxes.length - 1
  }

  return (
    checkboxes && (
      <div className="checkbox-group-wrapper">
        <GroupWrapper layout={config.layout}>
          {checkboxes.map((checkbox, index) => (
            <ItemWrapper key={index} layout={config.layout} index={index} noItems={noItems}>
              <UeCheckbox
                id={checkbox.id}
                label={checkbox.label}
                disabled={disabled || checkbox.disabled}
                hasValidationError={validationErrors.length > 0}
                question={question}
                wrapperAdditionalStyles={shouldHaveItemPadding(index) ? 'iu-pb-400' : ''}
              />
            </ItemWrapper>
          ))}
          <QuestionValidationTexts validationErrors={validationErrors}></QuestionValidationTexts>
        </GroupWrapper>
      </div>
    )
  )
}

export default UeCheckboxGroup
