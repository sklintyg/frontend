import { useState } from 'react'
import { useSelector } from 'react-redux'
import Checkbox from '../../../../components/Inputs/Checkbox'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getShowValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../../store/store'
import type { CertificateDataElement, ValueBoolean, ValueCode, ValueCodeList } from '../../../../types'
import { CertificateDataValueType, ConfigTypes } from '../../../../types'

export interface Props {
  label?: string
  name?: string
  id?: string
  checked?: boolean
  hasValidationError?: boolean
  checkboxAdditionalStyles?: string
  wrapperAdditionalStyles?: string
  disabled?: boolean
  question: CertificateDataElement
}

const UeCheckbox = (props: Props) => {
  const { label, id, question, checked, hasValidationError, disabled } = props
  const dispatch = useAppDispatch()
  const isShowValidationError = useSelector(getShowValidationErrors)
  const isSingleCheckbox = question.config.type !== ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setIsChecked(event.currentTarget.checked)
    let updatedValue = question
    if (question.config.type === ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE) {
      updatedValue = getUpdatedCodeListValue(question, event.currentTarget.checked, id || question.id)
    } else if (question.config.type === ConfigTypes.UE_CHECKBOX_BOOLEAN) {
      updatedValue = getUpdatedBooleanValue(question, event.currentTarget.checked)
    }
    dispatch(updateCertificateDataElement(updatedValue))
  }

  const getChecked = (): boolean => {
    if (question.value?.type === CertificateDataValueType.CODE_LIST) {
      return question.value.list.some((x) => x.code === id)
    } else if (question.value?.type === CertificateDataValueType.BOOLEAN) {
      return question.value.selected === true
    }
    return false
  }

  const [isChecked, setIsChecked] = useState(checked ? checked : getChecked())

  return (
    <div>
      <Checkbox
        id={question.id + id}
        label={label ? label : (question.config.label as string)}
        value={id}
        checked={isChecked}
        vertical={true}
        disabled={disabled}
        onChange={handleChange}
        hasValidationError={!disabled && hasValidationError}
        wrapperAdditionalStyles={props.wrapperAdditionalStyles}
      />
      {isShowValidationError && isSingleCheckbox && (
        <QuestionValidationTexts validationErrors={question.validationErrors || []}></QuestionValidationTexts>
      )}
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
    updatedValueList = [...updatedValueList, { code: id, id: id, type: CertificateDataValueType.CODE } as ValueCode]
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
