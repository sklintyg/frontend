import { CertificateDataElement, Dropdown, TextInput, ConfigureUeUncertainDate, QuestionValidationTexts, ValueDate } from '@frontend/common'
import { ConfigUeDropdownItem } from '@frontend/common/src/types/certificate'
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../store/store'

const ValidationWrapper = styled.div`
  flex: 0 !important;
  flex-basis: 100% !important;
  padding-bottom: 16px;
  margin-top: 0;
`

export interface Props {
  label?: string
  id: string
  hasValidationError?: boolean
  disabled?: boolean
  question: CertificateDataElement
}

const UeUncertainDate: React.FC<Props> = (props) => {
  const { label, id, question, hasValidationError, disabled } = props
  const config = question.config as ConfigureUeUncertainDate
  const validationErrors = useSelector(getVisibleValidationErrors(question.id, id))
  const dispatch = useAppDispatch()
  const [selectedYear, setSelectedYear] = React.useState(getYear((question.value as ValueDate).date))
  const [selectedMonth, setSelectedMonth] = React.useState(getMonth((question.value as ValueDate).date))
  const [selectedDay, setSelectedDay] = React.useState('00')
  const [disabledMonth, setDisabledMonth] = React.useState(
    disabled || getYear((question.value as ValueDate).date) == '0000' || getYear((question.value as ValueDate).date) == ''
  )

  let years: ConfigUeDropdownItem[] = [{ id: '', label: 'Ange år' }]

  if (config.unknownYear) years.push({ id: '0000', label: '0000 (ej känt)' })
  config.allowedYears.map((item) => {
    years.push({ id: item, label: item })
  })

  let months: ConfigUeDropdownItem[] = [{ id: '', label: 'Ange månad' }]
  if (config.unknownMonth) months.push({ id: '00', label: '00 (ej känt)' })
  for (let i = 1; i <= 12; i++) {
    let strMonth = '0' + i.toString()
    let month = strMonth.substring(strMonth.length - 2)
    months.push({ id: month, label: month })
  }

  const handleYearChange = (value: string) => {
    setSelectedYear(value)
    if (value == '') setSelectedMonth('')
    if (value == '0000') setSelectedMonth('00')
    setDisabledMonth(disabled || value == '0000' || value == '')
    dispatch(updateCertificateDataElement(getUpdatedDateValue(question, id, selectedYear, selectedMonth)))
  }

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value)
    dispatch(updateCertificateDataElement(getUpdatedDateValue(question, id, selectedYear, selectedMonth)))
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
        <TextInput
          id={'day_' + question.id}
          label="Dag"
          onChange={(event) => setSelectedDay('00')}
          disabled={true}
          value="00"
          className="iu-color-muted iu-border-muted"
        />
      </div>
      <ValidationWrapper>
        <QuestionValidationTexts validationErrors={validationErrors} />
      </ValidationWrapper>
    </div>
  )
}

const getYear = (date: string) => {
  let year = ''
  if (date && date.indexOf('-') == 4) year = date.split('-')[0]
  return year
}
const getMonth = (date: string) => {
  if (date && date.indexOf('-') == 4 && getYear(date) != '0000' && getYear(date) != '') {
    const monthPart: string = date.split('-')[1]
    return monthPart && monthPart.length == 2 ? monthPart : ''
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
