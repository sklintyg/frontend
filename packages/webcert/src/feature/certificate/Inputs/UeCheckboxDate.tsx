import React from 'react'
import { CertificateDataValueType, Checkbox } from '@frontend/common'
import { CertificateDataElement, ConfigTypes, QuestionValidationTexts, ValueDate, ValueDateList } from '@frontend/common/src'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../store/store'
import { useSelector } from 'react-redux'
import { getShowValidationErrors } from '../../../store/certificate/certificateSelectors'
import DatePickerCustom from './DatePickerCustom'
import { format } from 'date-fns'
import styled from 'styled-components/macro'

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;

  > * {
    flex: 1;
  }
`

const ValidationWrapper = styled.div`
  flex: 0 !important;
  flex-basis: 100% !important;
`

interface Props {
  label?: string
  id: string
  hasValidationError?: boolean
  checkboxAdditionalStyles?: string
  disabled?: boolean
  question: CertificateDataElement
  date: string | null
}

const UeCheckboxDate: React.FC<Props> = (props) => {
  const _format = 'yyyy-MM-dd'
  const { label, id, question, hasValidationError, disabled, date } = props
  const dispatch = useAppDispatch()
  const values = (question.value as ValueDateList).list
  const [checked, setChecked] = React.useState(values.some((e: ValueDate) => e.id === id))
  const isShowValidationError = useSelector(getShowValidationErrors)
  const isSingleCheckboxDate = question.config.type !== ConfigTypes.UE_CHECKBOX_MULTIPLE_DATE
  const [dateString, setDateString] = React.useState(date ? date : null)

  const handleChange = (checked: boolean, date: string) => {
    setChecked(checked && date !== '' && date !== null)
    setDateString(checked ? date : null)
    const updatedValue = getUpdatedDateListValue(question, checked, id, date)
    dispatch(updateCertificateDataElement(updatedValue))
  }

  const handleCheckboxChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    handleChange(event.target.checked, format(new Date(), _format))
  }

  const handleDateChange = (date: string) => {
    handleChange(true, date)
  }

  const handleTextChange = (value: string) => {
    handleChange(true, value)
  }

  return (
    <Wrapper>
      <Checkbox
        id={'checkbox_' + id}
        label={label}
        checked={checked}
        vertical={true}
        disabled={disabled}
        onChange={handleCheckboxChange}
        hasValidationError={hasValidationError}
      />
      <DatePickerCustom
        disabled={disabled}
        textInputOnChange={handleTextChange}
        setDate={handleDateChange}
        inputString={dateString}></DatePickerCustom>
      {isShowValidationError && (
        <ValidationWrapper>
          <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>
        </ValidationWrapper>
      )}
    </Wrapper>
  )
}

const getUpdatedDateListValue = (question: CertificateDataElement, checked: boolean, id: string, date: string) => {
  const updatedQuestion: CertificateDataElement = { ...question }

  const updatedQuestionValue = { ...(updatedQuestion.value as ValueDateList) }
  let updatedValueList = [...updatedQuestionValue.list]

  const updatedValueIndex = updatedValueList.findIndex((val) => val.id === id)
  if (updatedValueIndex === -1 && checked) {
    updatedValueList = [...updatedValueList, { id: id, date: date, type: CertificateDataValueType.DATE } as ValueDate]
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
