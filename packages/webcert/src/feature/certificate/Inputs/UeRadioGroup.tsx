import React, { useState } from 'react'
import { CertificateDataElement, QuestionValidationTexts, ConfigUeRadioMultipleCodes, RadioButton, ValueCode } from '@frontend/common'
import { useSelector } from 'react-redux'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../store/certificate/certificateSelectors'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../store/store'

interface Props {
  disabled: boolean
  question: CertificateDataElement
}

const UeRadioGroup: React.FC<Props> = ({ question, disabled }) => {
  const radiobuttons = (question.config as ConfigUeRadioMultipleCodes).list
  const [code, setCode] = useState(question.value?.code)
  const isShowValidationError = useSelector(getShowValidationErrors)
  const shouldDisplayValidationError = useSelector(getQuestionHasValidationError(question.id))
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

  const renderRadioButtons = () => {
    if (!radiobuttons) {
      return null
    }
    return radiobuttons.map((radio, index) => (
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
      />
    ))
  }

  return (
    <div role="radiogroup" className={`radio-group-wrapper ${shouldBeHorizontal ? 'ic-radio-group-horizontal' : ''}`}>
      {renderRadioButtons()}
      {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>}
    </div>
  )
}

export default UeRadioGroup
