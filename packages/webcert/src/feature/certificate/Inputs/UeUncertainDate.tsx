import { CertificateDataElement, Dropdown, ConfigureUeUncertainDate, QuestionValidationTexts, ValueDate } from '@frontend/common'
import { ConfigUeDropdownItem } from '@frontend/common/src/types/certificate'
import React from 'react'
import styled from 'styled-components/macro'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../store/store'

const ValidationWrapper = styled.div`
  flex: 0 !important;
  flex-basis: 100% !important;
  padding-bottom: 16px;
  margin-top: 0;
`

export interface Props {
  hasValidationError?: boolean
  disabled?: boolean
  question: CertificateDataElement
}

const UeUncertainDate: React.FC<Props> = (props) => {
  const { question, hasValidationError, disabled } = props
  const config = question.config as ConfigureUeUncertainDate
  const dispatch = useAppDispatch()
  const [selectedYear, setSelectedYear] = React.useState(getYear((question.value as ValueDate).date))
  const [selectedMonth, setSelectedMonth] = React.useState(getMonth((question.value as ValueDate).date))
  const [disabledMonth, setDisabledMonth] = React.useState(
    disabled || getYear((question.value as ValueDate).date) === '0000' || getYear((question.value as ValueDate).date) === ''
  )

  const years: ConfigUeDropdownItem[] = [{ id: '', label: 'Ange år' }]

  if (config.unknownYear) years.push({ id: '0000', label: '0000 (ej känt)' })
  config.allowedYears.forEach((item) => {
    years.push({ id: item, label: item })
  })

  const months: ConfigUeDropdownItem[] = [{ id: '', label: 'Ange månad' }]
  if (config.unknownMonth) months.push({ id: '00', label: '00 (ej känt)' })
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
        <input id={'day_' + question.id} type="text" disabled={true} value="00" className="ic-textfield iu-color-muted iu-border-muted" />
      </div>
      <ValidationWrapper>
        <QuestionValidationTexts validationErrors={question.validationErrors} />
      </ValidationWrapper>
    </div>
  )
}

const getYear = (date: string) => {
  let year = ''
  if (date && date.indexOf('-') === 4) year = date.split('-')[0]
  return year
}
const getMonth = (date: string) => {
  if (date && date.indexOf('-') === 4 && getYear(date) !== '0000' && getYear(date) !== '') {
    const monthPart: string = date.split('-')[1]
    return monthPart && monthPart.length === 2 ? monthPart : ''
  } else return ''
}

const getUpdatedDateValue = (question: CertificateDataElement, id: string, year: string, month: string) => {
  const updatedQuestion: CertificateDataElement = { ...question }

  const updatedValue = { ...(updatedQuestion.value as ValueDate) }

  updatedValue.id = id
  updatedValue.date = `${year}-${month}-00`

  updatedQuestion.value = updatedValue

  return updatedQuestion
}

export default UeUncertainDate
