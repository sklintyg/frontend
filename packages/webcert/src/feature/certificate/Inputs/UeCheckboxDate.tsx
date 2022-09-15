import {
  CertificateDataElement,
  CertificateDataValueType,
  Checkbox,
  ConfigTypes,
  DatePickerCustom,
  getMaxDate,
  getValidDate,
  QuestionValidationTexts,
  ValidationError,
  ValueDate,
  ValueDateList,
} from '@frontend/common'
import { format, isValid } from 'date-fns'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import { updateCertificateDataElement, updateClientValidationError } from '../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../store/store'

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
`

const ValidationWrapper = styled.div`
  flex: 0 !important;
  flex-basis: 100% !important;
  padding-bottom: 16px;
  margin-top: 0;
`

interface Props {
  label?: string
  id: string
  hasValidationError?: boolean
  checkboxAdditionalStyles?: string
  datePickerAdditionalStyles?: string
  disabled?: boolean
  question: CertificateDataElement
  date: string | null
}

const UeCheckboxDate: React.FC<Props> = (props) => {
  const _format = 'yyyy-MM-dd'
  const { label, id, question, hasValidationError, disabled, date } = props
  const dispatch = useAppDispatch()
  const values = (question.value as ValueDateList).list
  const isSingleCheckboxDate = question.config.type !== ConfigTypes.UE_CHECKBOX_MULTIPLE_DATE
  const [checked, setChecked] = React.useState(
    isSingleCheckboxDate ? (question.value as ValueDate).date !== undefined : values.some((e: ValueDate) => e.id === id)
  )
  const [dateString, setDateString] = React.useState(date ? date : null)
  const validationErrors = useSelector(getVisibleValidationErrors(question.id, id))

  const getUpdatedValue = (question: CertificateDataElement, checked: boolean, id: string, date: string) => {
    if (isSingleCheckboxDate) {
      return getUpdatedDateValue(question, checked, id, date)
    } else {
      return getUpdatedDateListValue(question, checked, id, date)
    }
  }

  const deleteDateFromSavedValue = () => {
    dispatch(updateCertificateDataElement(getUpdatedValue(question, false, id, '')))
  }

  const handleChange = (checked: boolean, date: string) => {
    setChecked(checked && date !== '' && date !== null)
    setDateString(checked ? date : null)

    if (date === '') {
      deleteDateFromSavedValue()
    }

    const parsedDate = getValidDate(date)

    if (isValid(parsedDate)) {
      dispatch(updateCertificateDataElement(getUpdatedValue(question, checked, id, date)))
    }
  }

  const dispatchValidationError = useCallback(
    (shouldBeRemoved: boolean, validationError: ValidationError) => {
      dispatch(updateClientValidationError({ shouldBeRemoved: shouldBeRemoved, validationError: validationError }))
    },
    [dispatch]
  )

  return (
    <Wrapper>
      <Checkbox
        id={'checkbox_' + id}
        label={label}
        checked={checked}
        vertical={true}
        disabled={disabled}
        onChange={(event) => {
          handleChange(event.target.checked, format(new Date(), _format))
        }}
        hasValidationError={hasValidationError}
        checkboxAdditionalStyles={props.checkboxAdditionalStyles}
      />
      <DatePickerCustom
        disabled={disabled}
        textInputOnChange={(value: string) => {
          handleChange(true, value)
        }}
        setDate={(date: string) => {
          handleChange(true, date)
        }}
        inputString={dateString}
        additionalStyles={props.datePickerAdditionalStyles}
        questionId={question.id}
        displayValidationErrorOutline={hasValidationError || validationErrors.length > 0}
        componentField={id}
        onDispatchValidationError={dispatchValidationError}
        max={getMaxDate(question.validation, id)}
      />
      <ValidationWrapper>
        <QuestionValidationTexts validationErrors={validationErrors} />
      </ValidationWrapper>
    </Wrapper>
  )
}

const getUpdatedDateListValue = (question: CertificateDataElement, checked: boolean, id: string, date: string): CertificateDataElement => {
  const updatedQuestion: CertificateDataElement = { ...question }
  const updatedQuestionValue = { ...(updatedQuestion.value as ValueDateList) }

  updatedQuestionValue.list = (updatedQuestionValue.list ?? [])
    .filter((item) => item.id !== id)
    .concat(checked ? { id: id, date: date, type: CertificateDataValueType.DATE } : [])

  updatedQuestion.value = updatedQuestionValue

  return updatedQuestion
}

const getUpdatedDateValue = (question: CertificateDataElement, checked: boolean, id: string, date: string) => {
  const updatedQuestion: CertificateDataElement = { ...question }

  const updatedValue = { ...(updatedQuestion.value as ValueDate) }
  if (checked) {
    updatedValue.id = id
    updatedValue.date = date
  } else {
    updatedValue.id = ''
    updatedValue.date = ''
  }

  updatedQuestion.value = updatedValue

  return updatedQuestion
}

export default UeCheckboxDate
