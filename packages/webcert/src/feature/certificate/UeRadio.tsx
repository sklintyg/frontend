import * as React from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store/store'
import { CertificateBooleanValue, CertificateDataElement, CertificateDataValueType } from '@frontend/common'
import { updateCertificateDataElement } from '../../store/certificate/certificateActions'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../store/certificate/certificateSelectors'
import { QuestionValidationTexts, RadioButton } from '@frontend/common/src'

interface UeRadioProps {
  question: CertificateDataElement
}

const UeRadio: React.FC<UeRadioProps> = ({ question }) => {
  const isShowValidationError = useSelector(getShowValidationErrors)
  const booleanValue = getBooleanValue(question)
  const dispatch = useAppDispatch()
  const shouldDisplayValidationError = useSelector(getQuestionHasValidationError(question.id))

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const updatedValue = getUpdatedValue(question, event.currentTarget.value === 'true')
    dispatch(updateCertificateDataElement(updatedValue))
  }

  if (!booleanValue) {
    return <div>Value not supported!</div>
  }

  return (
    <>
      <RadioButton
        hasValidationError={shouldDisplayValidationError}
        label={booleanValue.selectedText}
        name={question.config.prop + 'true'}
        value={true}
        checked={booleanValue.selected !== null && booleanValue.selected}
        onChange={handleChange}></RadioButton>
      <RadioButton
        hasValidationError={shouldDisplayValidationError}
        label={booleanValue.unselectedText}
        name={question.config.prop + 'false'}
        value={false}
        checked={booleanValue.selected !== null && !booleanValue.selected}
        onChange={handleChange}></RadioButton>
      {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>}
    </>
  )
}

function getBooleanValue(question: CertificateDataElement): CertificateBooleanValue | null {
  if (question.value.type !== CertificateDataValueType.BOOLEAN) {
    return null
  }
  return question.value as CertificateBooleanValue
}

function getUpdatedValue(question: CertificateDataElement, selected: boolean): CertificateDataElement {
  const updatedQuestion: CertificateDataElement = { ...question }
  updatedQuestion.value = { ...updatedQuestion.value }
  ;(updatedQuestion.value as CertificateBooleanValue).selected = selected
  return updatedQuestion
}

export default UeRadio
