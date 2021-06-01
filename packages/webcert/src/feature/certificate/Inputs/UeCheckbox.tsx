import React, { useState } from 'react'
import {
  CertificateDataElement,
  CertificateDataValueType,
  Checkbox,
  ConfigTypes,
  QuestionValidationTexts,
  ValueBoolean,
  ValueCode,
  ValueCodeList,
} from '@frontend/common'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../store/store'
import { useSelector } from 'react-redux'
import { getShowValidationErrors } from '../../../store/certificate/certificateSelectors'
import { css } from 'styled-components'

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

const wrapperStyles = css`
  padding-top: 14px;
`

const UeCheckbox: React.FC<Props> = (props) => {
  const { label, id, question, checked, hasValidationError, disabled } = props
  const dispatch = useAppDispatch()
  const values = (question.value as ValueCodeList).list
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
    if (question.config.type === ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE) {
      return values.some((x) => x.code === id)
    } else if (question.config.type === ConfigTypes.UE_CHECKBOX_BOOLEAN && question.value) {
      return question.value.selected === true
    }
    return false
  }

  const [isChecked, setIsChecked] = useState(checked ? checked : getChecked())

  return (
    <div>
      <Checkbox
        id={id || question.id}
        label={label ? label : (question.config.label as string)}
        value={id}
        checked={isChecked}
        vertical={true}
        disabled={disabled}
        onChange={handleChange}
        hasValidationError={hasValidationError}
        wrapperStyles={!isSingleCheckbox ? wrapperStyles : undefined}
      />
      {isShowValidationError && isSingleCheckbox && (
        <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>
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
