import {
  CertificateDataElement,
  ConfigUeDropdownItem,
  ConfigUeUncertainDate,
  Dropdown,
  QuestionValidationTexts,
  TextInput,
  ValueUncertainDate,
} from '@frontend/common'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../../store/store'

const ValidationWrapper = styled.div`
  flex: 0 !important;
  flex-basis: 100% !important;
  padding-bottom: 0.9375rem;
  margin-top: 0;
`

export interface Props {
  disabled?: boolean
  question: CertificateDataElement
}

const dateReg = /[0-9]{4}-[0-9]{2}/
const monthList = Array.from({ length: 12 }, (_, index) => `0${++index}`.slice(-2))

const getDateSplit = (candidate: string) => [...(dateReg.test(candidate) ? candidate : '').split('-'), ''].slice(0, 2)

const UeUncertainDate: React.FC<Props> = ({ question, disabled }) => {
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))
  const dispatch = useAppDispatch()
  const config = question.config as ConfigUeUncertainDate
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
    { id: '', label: 'Ange månad' },
    ...(config.unknownMonth ? [{ id: '00', label: '00 (ej känt)' }] : []),
    ...monthList.map((month) => ({ id: month, label: month })),
  ]

  const handleValueChanged = useCallback(
    (year: string, month: string) => {
      const value = `${year}-${month}-00`
      if ((question.value as ValueUncertainDate)?.value !== value) {
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
    const yearUnknown = ['0000'].includes(selectedYear)
    setDisabledMonth(disabled || selectedYear === '' || yearUnknown)
    setSelectedMonth((current) => (yearUnknown ? '00' : disabledMonth ? '' : current))
    handleValueChanged(selectedYear, selectedMonth)
  }, [disabled, selectedYear, selectedMonth, handleValueChanged, disabledMonth])

  return (
    <>
      <div className="ic-forms__group iu-grid-cols">
        <div>
          <Dropdown
            id={`year_${question.id}`}
            label="År"
            disabled={disabled}
            onChange={(event) => setSelectedYear(event.target.value)}
            value={selectedYear}
            error={validationErrors.some((v) => v.field.includes(`${config.id}.year`))}>
            {years.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </Dropdown>
        </div>
        <div>
          <Dropdown
            id={`month_${question.id}`}
            label="Månad"
            disabled={disabledMonth}
            onChange={(event) => setSelectedMonth(event.currentTarget.value)}
            value={selectedMonth}
            error={validationErrors.some((v) => v.field.includes(`${config.id}.month`))}>
            {months.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </Dropdown>
        </div>
        <div className="iu-width-xxl">
          <label htmlFor={`day_${question.id}`}>Dag</label>
          <TextInput id={`day_${question.id}`} disabled={true} hasValidationError={hasValidationError} value="00" />
        </div>
      </div>
      <ValidationWrapper>
        <QuestionValidationTexts validationErrors={validationErrors} />
      </ValidationWrapper>
    </>
  )
}

export default UeUncertainDate
