import { CertificateDataElement, ConfigUeCheckboxMultipleCodes, QuestionValidationTexts } from '@frontend/common'
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

  return (
    checkboxes && (
      <>
        <GroupWrapper layout={config.layout}>
          {checkboxes.map((checkbox, index) => (
            <ItemWrapper key={index} layout={config.layout} index={index} noItems={noItems}>
              <UeCheckbox
                id={checkbox.id}
                label={checkbox.label}
                disabled={disabled || checkbox.disabled}
                hasValidationError={validationErrors.length > 0}
                question={question}
              />
            </ItemWrapper>
          ))}
          <QuestionValidationTexts validationErrors={validationErrors}></QuestionValidationTexts>
        </GroupWrapper>
      </>
    )
  )
}

export default UeCheckboxGroup
