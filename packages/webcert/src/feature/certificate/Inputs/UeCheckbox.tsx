import React, { ChangeEvent, useRef } from 'react'
import { Checkbox } from '@frontend/common'
import { CertificateDataElement, ValueCode, ValueCodeList } from '@frontend/common/src'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../store/store'

interface Props {
  label: string
  name?: string
  id: string
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

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const updatedValue = getUpdatedValue(question, event.currentTarget.checked, id)
    dispatch(updateCertificateDataElement(updatedValue))
  }

  return (
    <Checkbox
      id={id}
      label={label}
      value={id}
      checked={checked || values.some((x) => x.code === id)}
      vertical={true}
      disabled={disabled}
      onChange={handleChange}
      hasValidationError={hasValidationError}
    />
  )
}

const getUpdatedValue = (question: CertificateDataElement, checked: boolean, id: string) => {
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
