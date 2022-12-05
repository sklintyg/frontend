import {
  CertificateDataElement,
  Dropdown,
  ConfigureUeUncertainDate,
  QuestionValidationTexts,
  ValueUncertainDate,
  TextInput,
} from '@frontend/common'
import { ConfigUeDropdownItem } from '@frontend/common/src/types/certificate'
import React, { useState, useEffect, useCallback } from 'react'
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
const styleTextField = {
  height: '50px',
  padding: '0.4em 0 0 1.5em',
}

export interface Props {
  disabled?: boolean
  question: CertificateDataElement
}

const DisabledTextInput = styled(TextInput)`
  border: 0.0625rem solid #acacac;
  opacity: 0.7 !important;
`

const dateReg = /[0-9]{4}-[0-9]{2}/
const monthList = Array.from({ length: 12 }, (_, index) => `0${++index}`.slice(-2))

const getDateSplit = (candidate: string) => [...(dateReg.test(candidate) ? candidate : '').split('-'), ''].slice(0, 2)

const UeUncertainDate: React.FC<Props> = ({ question, disabled }) => {
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))
  const dispatch = useAppDispatch()
  const config = question.config as ConfigureUeUncertainDate
  const value = question.value as ValueUncertainDate
  const hasValidationError = validationErrors.length > 0
  const [year, month] = getDateSplit(value.value ?? '')
  const [selectedYear, setSelectedYear] = useState(year)
  const [selectedMonth, setSelectedMonth] = useState(month)
  const [disabledMonth, setDisabledMonth] = useState(disabled)

  const years: ConfigUeDropdownItem[] = [
    { id: '', label: 'Ange år' },
    ...(config.unknownYear ? [{ id: '0000', label: '0000 (ej känt)' }] : []),
    ...(config.allowedYears ?? []).map((year) => ({ id: year, label: year })),
  ]

  const months: ConfigUeDropdownItem[] = [
    ...(!config.unknownMonth ? [{ id: '', label: 'Ange månad' }] : []),
    ...(config.unknownMonth ? [{ id: '00', label: '00 (ej känt)' }] : []),
    ...monthList.map((month) => ({ id: month, label: month })),
  ]

  const defaultMonth = config.unknownMonth ? '00' : ''

  const handleValueChanged = useCallback(
    (year: string, month: string) => {
      const value = `${year}-${month}-00`
      if (question.value?.value !== value) {
        dispatch(
          updateCertificateDataElement({
            ...question,
            value: {
              ...(question.value as ValueUncertainDate),
              value,
            },
          })
        )
      }
    },
    [dispatch, question]
  )

  useEffect(() => {
    const yearUnknown = ['', '0000'].includes(selectedYear)
    setSelectedMonth((current) => (yearUnknown ? defaultMonth : current))
    setDisabledMonth(disabled || yearUnknown)
    handleValueChanged(selectedYear, selectedMonth)
  }, [disabled, selectedYear, selectedMonth, handleValueChanged, defaultMonth])

  return (
    <>
      <div className="ic-forms__group iu-grid-cols">
        <div>
          <Dropdown
            id={`year_${question.id}`}
            label="År"
            options={years.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
            disabled={disabled}
            onChange={(event) => setSelectedYear(event.target.value)}
            value={selectedYear}
            hasValidationError={validationErrors.some((v) => v.field.includes(`${question.id}.year`))}
          />
        </div>
        <div>
          <Dropdown
            id={`month_${question.id}`}
            label="Månad"
            options={months.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
            disabled={disabledMonth}
            onChange={(event) => setSelectedMonth(event.currentTarget.value)}
            value={selectedMonth}
            hasValidationError={validationErrors.some((v) => v.field.includes(`${question.id}.month`))}
          />
        </div>
        <div className="iu-width-xxl">
          <label htmlFor={`day_${question.id}`}>Dag</label>
          <DisabledTextInput
            id={`day_${question.id}`}
            disabled={true}
            hasValidationError={hasValidationError}
            value="00"
            css={styleTextField}
          />
        </div>
      </div>
      <ValidationWrapper>
        <QuestionValidationTexts validationErrors={validationErrors} />
      </ValidationWrapper>
    </>
  )
}

export default UeUncertainDate
