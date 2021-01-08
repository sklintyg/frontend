import React from 'react'
import { Checkbox } from '@frontend/common'
import { CertificateDataElement, ConfigTypes, QuestionValidationTexts, ValueDate, ValueDateList } from '@frontend/common/src'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../store/store'
import { useSelector } from 'react-redux'
import { getShowValidationErrors } from '../../../store/certificate/certificateSelectors'

interface Props {
  label?: string
  id: string
  hasValidationError?: boolean
  checkboxAdditionalStyles?: string
  disabled?: boolean
  question: CertificateDataElement
  date?: string
}

const UeCheckboxDate: React.FC<Props> = (props) => {
  const { label, id, question, hasValidationError, disabled, date } = props
  const dispatch = useAppDispatch()
  const values = (question.value as ValueDateList).list
  const isShowValidationError = useSelector(getShowValidationErrors)

  const handleChange = (checked: boolean, date: string) => {
    const updatedValue = getUpdatedDateListValue(question, checked, id, date)
    dispatch(updateCertificateDataElement(updatedValue))
  }

  const handleCheckboxChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    handleChange(event.target.checked, new Date().toDateString())
  }

  const getChecked = (): boolean => {
    return values.some((e: ValueDate) => e.id === id)
  }

  const handleDateChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    handleChange(true, event.target.value)
  }

  return (
    <div>
      <Checkbox
        id={'checkbox_' + id}
        label={label}
        checked={getChecked()}
        vertical={true}
        disabled={disabled}
        onChange={handleCheckboxChange}
        hasValidationError={hasValidationError}
      />
      <input type="date" id={'date_' + question.id} value={date} onChange={handleDateChange}></input>
      {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>}
    </div>
  )
}

const getUpdatedDateListValue = (question: CertificateDataElement, checked: boolean, id: string, date: string) => {
  const updatedQuestion: CertificateDataElement = { ...question }

  const updatedQuestionValue = { ...(updatedQuestion.value as ValueDateList) }
  let updatedValueList = [...(updatedQuestionValue.list as ValueDate[])]

  const updatedValueIndex = updatedValueList.findIndex((val) => val.id === id)
  if (updatedValueIndex === -1 && checked) {
    if (date === '' || date === undefined) {
      date = new Date().toDateString()
    }
    updatedValueList = [...updatedValueList, { id: id, date: date } as ValueDate]
  } else {
    if (!checked) {
      updatedValueList.splice(updatedValueIndex, 1)
    }
  }
  updatedQuestionValue.list = updatedValueList
  updatedQuestion.value = updatedQuestionValue

  return updatedQuestion
}

export default UeCheckboxDate
