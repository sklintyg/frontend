import { useSelector } from 'react-redux'
import RadioButton from '../../../../components/Inputs/RadioButton'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../../store/store'
import type { CertificateDataElement, ConfigUeRadioBoolean, ValueBoolean } from '../../../../types';
import { CertificateDataValueType } from '../../../../types'

export interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const UeRadio: React.FC<Props> = ({ question, disabled }) => {
  const booleanValue = getBooleanValue(question)
  const questionConfig = question.config as ConfigUeRadioBoolean
  const dispatch = useAppDispatch()
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const updatedValue = getUpdatedValue(question, event.currentTarget.value === 'true')
    dispatch(updateCertificateDataElement(updatedValue))
  }

  if (!booleanValue) {
    return <div>Value not supported!</div>
  }

  return (
    <>
      <div
        role="radiogroup"
        aria-label="Radiogrupp"
        className={`ic-radio-group-horizontal ${validationErrors.length > 0 ? 'iu-mb-300' : ''}`}
      >
        <RadioButton
          disabled={disabled}
          hasValidationError={validationErrors.length > 0}
          label={questionConfig.selectedText}
          id={questionConfig.id + 'true'}
          name={questionConfig.id + 'radio'}
          value={'true'}
          checked={booleanValue.selected !== null && booleanValue.selected}
          onChange={handleChange}
        />
        <RadioButton
          disabled={disabled}
          hasValidationError={validationErrors.length > 0}
          label={questionConfig.unselectedText}
          id={questionConfig.id + 'false'}
          name={questionConfig.id + 'radio'}
          value={'false'}
          checked={booleanValue.selected !== null && !booleanValue.selected}
          onChange={handleChange}
        />
      </div>
      <QuestionValidationTexts validationErrors={validationErrors} />
    </>
  )
}

function getBooleanValue(question: CertificateDataElement): ValueBoolean | null {
  if (question.value?.type !== CertificateDataValueType.BOOLEAN) {
    return null
  }
  return question.value as ValueBoolean
}

function getUpdatedValue(question: CertificateDataElement, selected: boolean): CertificateDataElement {
  const updatedQuestion: CertificateDataElement = { ...question }
  updatedQuestion.value = { ...(updatedQuestion.value as ValueBoolean) }
  ;(updatedQuestion.value as ValueBoolean).selected = selected
  return updatedQuestion
}

export default UeRadio
