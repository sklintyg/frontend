import React from 'react'
import { Checkbox } from '@frontend/common'
import { CertificateDataElement, ConfigTypes, QuestionValidationTexts, ValueBoolean, ValueCode, ValueCodeList } from '@frontend/common/src'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../store/store'
import { useSelector } from 'react-redux'
import { getShowValidationErrors } from '../../../store/certificate/certificateSelectors'

interface Props {
  label?: string
  name?: string
  id?: string
  checked?: boolean
  hasValidationError?: boolean
  checkboxAdditionalStyles?: string
  disabled?: boolean
  question: CertificateDataElement
}

const UeCheckbox: React.FC<Props> = (props) => {
  const { label, id, question, checked, hasValidationError, disabled } = props
  const dispatch = useAppDispatch()
  const values = (question.value as ValueCodeList).list
  const isShowValidationError = useSelector(getShowValidationErrors)

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    let updatedValue = question
    if (question.config.type === ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE) {
      updatedValue = getUpdatedCodeListValue(question, event.currentTarget.checked, id || question.id)
    } else if (question.config.type === ConfigTypes.UE_CHECKBOX_BOOLEAN) {
      updatedValue = getUpdatedBooleanValue(question, event.currentTarget.checked)
    }
    dispatch(updateCertificateDataElement(updatedValue))
  }

  const getChecked = (): boolean => {
    if (question.config.type === ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE) {
      return values.some((x) => x.code === id)
    } else if (question.config.type === ConfigTypes.UE_CHECKBOX_BOOLEAN && question.value) {
      return question.value.selected === true
    }
    return false
  }

  return (
    <div>
      <Checkbox
        id={id || question.id}
        label={label ? label : question.config.label + ''}
        value={id}
        checked={checked ? checked : getChecked()}
        vertical={true}
        disabled={disabled}
        onChange={handleChange}
        hasValidationError={hasValidationError}
      />
      {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>}
    </div>
  )
}

const getUpdatedBooleanValue = (question: CertificateDataElement, checked: boolean) => {
  const updatedQuestion: CertificateDataElement = { ...question }
  updatedQuestion.value = { ...(updatedQuestion.value as ValueBoolean) }
  updatedQuestion.value.selected = checked
  return updatedQuestion
}

const getUpdatedCodeListValue = (question: CertificateDataElement, checked: boolean, id: string) => {
  const updatedQuestion: CertificateDataElement = { ...question }

  const updatedQuestionValue = { ...(updatedQuestion.value as ValueCodeList) }
  let updatedValueList = [...(updatedQuestionValue.list as ValueCode[])]

  const updatedValueIndex = updatedValueList.findIndex((val) => val.id === id)
  if (updatedValueIndex === -1 && checked) {
    updatedValueList = [...updatedValueList, { code: id, id: id } as ValueCode]
  } else {
    if (!checked) {
      updatedValueList.splice(updatedValueIndex, 1)
    }
  }
  updatedQuestionValue.list = updatedValueList
  updatedQuestion.value = updatedQuestionValue

  return updatedQuestion
}

export default UeCheckbox
