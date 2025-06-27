import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppSelector } from '../../../../store/store'
import type { CertificateDataElement, ConfigUeCheckboxMultipleCodes } from '../../../../types'
import { GroupWrapper } from '../GroupWrappers'
import { ItemWrapper } from '../ItemWrapper'
import UeCheckbox from '../UeCheckbox/UeCheckbox'

export interface Props {
  disabled: boolean
  question: CertificateDataElement
}

const UeCheckboxGroup = ({ question, disabled }: Props) => {
  const config = question.config as ConfigUeCheckboxMultipleCodes
  const checkboxes = config.list
  const validationErrors = useAppSelector(getVisibleValidationErrors(question.id))

  const noItems = checkboxes.length

  return (
    checkboxes && (
      <>
        <GroupWrapper layout={config.layout} className={`${validationErrors.length > 0 ? 'iu-mb-300' : ''}`}>
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
        </GroupWrapper>
        <QuestionValidationTexts validationErrors={validationErrors}></QuestionValidationTexts>
      </>
    )
  )
}

export default UeCheckboxGroup
