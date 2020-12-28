import React from 'react'
import { CertificateDataElement, QuestionValidationTexts } from '@frontend/common'
import { useSelector } from 'react-redux'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../store/certificate/certificateSelectors'
import { ConfigTypes, ConfigUeRadioMultipleCodes, RadioButton, ValueCode, ValueCodeList } from '@frontend/common/src'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../store/store'

interface Props {
  disabled: boolean
  question: CertificateDataElement
}

const UeRadioGroup: React.FC<Props> = ({ question, disabled }) => {
  const radiobuttons = (question.config as ConfigUeRadioMultipleCodes).list
  const isShowValidationError = useSelector(getShowValidationErrors)
  const shouldDisplayValidationError = useSelector(getQuestionHasValidationError(question.id))
  const dispatch = useAppDispatch()

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    let updatedValue = question
    updatedValue = getUpdatedValue(question, event.currentTarget.value)
    dispatch(updateCertificateDataElement(updatedValue))
  }

  const getUpdatedValue = (question: CertificateDataElement, selected: string) => {
    const updatedQuestion: CertificateDataElement = { ...question }

    const updatedQuestionValue = { ...(updatedQuestion.value as ValueCode) }
    updatedQuestionValue.id = selected
    updatedQuestionValue.value = selected
    updatedQuestion.value = updatedQuestionValue

    return updatedQuestion
  }

  const renderRadioButtons = () => {
    if (!radiobuttons) {
      return null
    }
    return radiobuttons.map((radio, index) => (
      <RadioButton
        id={radio.id + ''}
        value={radio.id}
        name={question.id}
        key={index}
        label={radio.label}
        disabled={disabled}
        checked={radio.id === question.value?.id}
        onChange={handleChange}
      />
    ))
  }

  return (
    <div className="radio-group-wrapper">
      <div>
        <div className="radio-child">{renderRadioButtons()}</div>
        {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>}
      </div>
    </div>
  )
}

export default UeRadioGroup
