import { CertificateDataElement, ConfigLayout, ConfigUeCheckboxMultipleCodes, QuestionValidationTexts } from '@frontend/common'
import React from 'react'
import { useSelector } from 'react-redux'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../store/certificate/certificateSelectors'
import { GroupWrapper, ItemWrapper } from './GroupWrappers'
import UeCheckbox from './UeCheckbox'

export interface Props {
  disabled: boolean
  question: CertificateDataElement
}

const UeCheckboxGroup: React.FC<Props> = ({ question, disabled }) => {
  const config = question.config as ConfigUeCheckboxMultipleCodes
  const checkboxes = config.list
  const isShowValidationError = useSelector(getShowValidationErrors)
  const shouldDisplayValidationError = useSelector(getQuestionHasValidationError(question.id))

  const noItems = checkboxes.length

  function isLastCheckbox(index: number) {
    return index === checkboxes.length - 1
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
                hasValidationError={shouldDisplayValidationError}
                question={question}
                wrapperAdditionalStyles={`${!isLastCheckbox(index) && config.layout !== ConfigLayout.INLINE ? '' : 'iu-pb-400'} `}
              />
            </ItemWrapper>
          ))}

          {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>}
        </GroupWrapper>
      </div>
    )
  )
}

export default UeCheckboxGroup
