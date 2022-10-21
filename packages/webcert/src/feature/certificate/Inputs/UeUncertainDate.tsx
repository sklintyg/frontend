import {
  CertificateDataElement,
  Dropdown,
  ConfigureUeUncertainDate,
  QuestionValidationTexts,
  ValueUncertainDate,
  TextInput,
} from '@frontend/common'
import { ConfigUeDropdownItem } from '@frontend/common/src/types/certificate'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { getQuestionHasValidationError } from '../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../store/store'

const ValidationWrapper = styled.div`
  flex: 0 !important;
  flex-basis: 100% !important;
  padding-bottom: 16px;
  margin-top: 0;
`
const styleTextField = {
  height: '50px',
  padding: '0.4em 0 0 1.5em',
}

export interface Props {
  disabled?: boolean
  question: CertificateDataElement
}

const UeUncertainDate: React.FC<Props> = ({ question, disabled }) => {
  const config = question.config as ConfigureUeUncertainDate
  const dispatch = useAppDispatch()
  const hasValidationError = useSelector(getQuestionHasValidationError(question.id))
  const [selectedYear, setSelectedYear] = useState(getYear(question))
  const [selectedMonth, setSelectedMonth] = useState(getMonth(question))
  const [disabledMonth, setDisabledMonth] = useState(disabled || getYear(question) === '0000' || getYear(question) === '')

  const years: ConfigUeDropdownItem[] = [{ id: '', label: 'Ange år' }]

  if (config.unknownYear) {
    years.push({ id: '0000', label: '0000 (ej känt)' })
  }

  if (config.allowedYears) {
    config.allowedYears.forEach((item) => {
      years.push({ id: item, label: item })
    })
  }

  const months: ConfigUeDropdownItem[] = [{ id: '', label: 'Ange månad' }]

  if (config.unknownMonth) {
    months.push({ id: '00', label: '00 (ej känt)' })
  }

  for (let i = 1; i <= 12; i++) {
    const strMonth = '0' + i.toString()
    const month = strMonth.substring(strMonth.length - 2)
    months.push({ id: month, label: month })
  }

  const handleYearChange = (value: string) => {
    setSelectedYear(value)
    if (value === '') setSelectedMonth('')
    if (value === '0000') setSelectedMonth('00')
    setDisabledMonth(disabled || value === '0000' || value === '')
    dispatch(updateCertificateDataElement(getUpdatedDateValue(question, question.id, selectedYear, selectedMonth)))
  }

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value)
    dispatch(updateCertificateDataElement(getUpdatedDateValue(question, question.id, selectedYear, selectedMonth)))
  }

  return (
    <div className="ic-forms__group iu-grid-cols">
      <div>
        <Dropdown
          id={'year_' + question.id}
          label="År"
          options={years.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
          disabled={disabled}
          onChange={(event) => handleYearChange(event.target.value)}
          value={selectedYear}
          hasValidationError={hasValidationError}
        />
      </div>
      <div>
        <Dropdown
          id={'month_' + question.id}
          label="Månad"
          options={months.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
          disabled={disabledMonth}
          onChange={(event) => handleMonthChange(event.currentTarget.value)}
          value={selectedMonth}
          hasValidationError={hasValidationError}
        />
      </div>
      <div className="iu-width-xxl">
        <label htmlFor={'day_' + question.id}>Dag</label>
        <TextInput id={'day_' + question.id} onChange={() => null} disabled={true} value="00" css={styleTextField} />
      </div>
      <ValidationWrapper>
        <QuestionValidationTexts validationErrors={question.validationErrors} />
      </ValidationWrapper>
    </div>
  )
}

const getYear = (question: CertificateDataElement) => {
  let year = ''
  const date: string = getDatelike(question)

  if (date) {
    year = date.split('-')[0]
  }
  return year
}

const getMonth = (question: CertificateDataElement) => {
  let month = ''
  const date: string = getDatelike(question)

  if (date && date.split('-')[0] !== '0000') {
    const monthPart: string = date.split('-')[1]
    month = monthPart && monthPart.length === 2 ? monthPart : ''
  }
  return month
}

const getDatelike = (question: CertificateDataElement) => {
  let datelike = ''
  const _dateReg = /[0-2][0-9]{3}-[0-9]{2}-[0-9]{2}/

  if (question && (question.value as ValueUncertainDate)) {
    const date: string = (question.value as ValueUncertainDate).date
    datelike = _dateReg.test(date) ? date : ''
  }
  return datelike
}

const getUpdatedDateValue = (question: CertificateDataElement, id: string, year: string, month: string) => {
  const updatedQuestion: CertificateDataElement = { ...question }

  const updatedValue = { ...(updatedQuestion.value as ValueUncertainDate) }

  updatedValue.id = id
  updatedValue.date = `${year}-${month}-00`

  updatedQuestion.value = updatedValue

  return updatedQuestion
}

export default UeUncertainDate
