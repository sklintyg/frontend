import React, { useEffect, useRef, useState } from 'react'
import DatePickerCustom from '../DatePickerCustom'
import { parse, addDays, differenceInCalendarDays, isEqual, isValid } from 'date-fns'
import ReactDatePicker from 'react-datepicker'
import colors from '../../../../components/styles/colors'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
// import { useSelector, useDispatch } from 'react-redux'
import { CertificateDataElement, ConfigUeCheckboxDateRange, ValueDateRange, ValueDateRangeList } from '@frontend/common'
import _ from 'lodash'
import styled, { css } from 'styled-components/macro'
import { Checkbox, getValidDate, formatDateToString, parseDayCodes } from '@frontend/common'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const DaysRangeWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
`

const DatesWrapper = styled.div`
  display: flex;
  align-items: center;

  p {
    margin-right: 8px;
  }

  label {
    margin-right: 0.625em;
  }
`
const DateRangeWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  & + & {
    margin-top: 20px;
  }

  & #fromWrapper {
    margin-right: 40px;
  }
`

const checkBoxStyles = css`
  margin-right: 40px;
  min-width: 120px;
`

const _dateReg = /[1-2][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/
const _dateRegDashesOptional = /[1-2][0-9]{3}-?(0[1-9]|1[0-2])-?(0[1-9]|[1-2][0-9]|3[0-1])/

const dayCodeReg = /^(?=\d*d\d*$)d?(?!0+d?$)(\d{1,3})d?$/i
const weekCodeReg = /^(?=\d*v\d*$)v?(?!0+v?$)(\d{1,3})v?$/i
const monthCodeReg = /^(?=\d*m\d*$)m?(?!0+m?$)(\d{1,2})m?$/i

const regexArray = [dayCodeReg, weekCodeReg, monthCodeReg]

interface Props {
  label: string
  periodId: string
  fromDate: string | null
  toDate: string | null
  updateValue: (valueId: string, fromDate: string | null, toDate: string | null) => void
  getPeriodStartingDate: (periodId: string) => string
}

const DateRangePicker: React.FC<Props> = ({ label, periodId, fromDate, toDate, updateValue, getPeriodStartingDate }) => {
  const [dateChecked, setDateChecked] = useState(!!fromDate || !!toDate)
  const [fromDateString, setFromDateString] = useState<string | null>(fromDate)
  const [toDateString, setToDateString] = useState<string | null>(toDate)
  const fromTextInputRef = useRef<null | HTMLInputElement>(null)
  const tomTextInputRef = useRef<null | HTMLInputElement>(null)
  const [displayValidationError, setDisplayValidationError] = useState(false)
  function usePrevious(value: any) {
    const ref = React.useRef(value)

    React.useEffect(() => {
      ref.current = value
    })

    return ref.current
  }

  const previousFromDateString = usePrevious(fromDateString)
  const previousToDateString = usePrevious(toDateString)

  useEffect(() => {
    const updateCheckbox = () => {
      if (fromDateString || toDateString) {
        setDateChecked(true)
      } else {
        setDateChecked(false)
      }
    }

    if (previousFromDateString !== fromDateString || previousToDateString !== toDateString) {
      updateCheckbox()
      updateValue(periodId, fromDateString, toDateString)
    }
  }, [toDateString, fromDateString, previousFromDateString, previousToDateString])

  const handleFromTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setFromDateString(value ?? null)

    if (!value) {
      return
    }

    const updatedFromDate = getValidDate(value)

    if (isValid(updatedFromDate)) {
      const dateString = formatDateToString(updatedFromDate!)
      setFromDateString(dateString)
    }
  }

  const handleDatePickerSelectFrom = (date: Date) => {
    setFromDateString(formatDateToString(date))
  }

  const handleDatePickerSelectTo = (date: Date) => {
    setToDateString(formatDateToString(date))
  }

  const handleToTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setToDateString(value)
  }

  const handleFromTextInputOnBlur = () => {
    const parsedToDate = getParsedToDateString(fromDateString, toDateString)
    toggleShowValidationError(fromDateString, parsedToDate ?? toDateString)
  }

  const handleToTextInputOnBlur = () => {
    formatToInputTextField()
    const parsedToDate = getParsedToDateString(fromDateString, toDateString)
    toggleShowValidationError(fromDateString, parsedToDate ?? toDateString)
  }

  const handleFromTextInputOnKeyDown = (event: React.KeyboardEvent) => {
    if (event.key.toLowerCase() === 'enter') {
      // toggleShowValidationError(fromDateString, toDateString)

      fromTextInputRef.current?.blur()
    }
  }

  const handleToTextInputOnKeyDown = (event: React.KeyboardEvent) => {
    if (event.key.toLowerCase() === 'enter') {
      // formatToInputTextField()
      // toggleShowValidationError(fromDateString, toDateString)
      // toggleShowValidationToDate(fromDateString!, toDateString!)

      tomTextInputRef.current?.blur()
    }
  }

  const toggleShowValidationError = (fromDate: string | null, toDate: string | null) => {
    // if(toDate){
    //   parsedToDate = parseDayCodes(toDate)
    // }

    if (fromDate && fromDate.length > 0 && !isValid(getValidDate(fromDate!))) {
      setDisplayValidationError(true)
    } else if (toDate && toDate.length > 0 && !isValid(getValidDate(toDate!))) {
      setDisplayValidationError(true)
    } else {
      setDisplayValidationError(false)
    }
  }

  const getParsedToDateString = (fromDateString: string | null, toDateString: string | null) => {
    if (!toDateString || !fromDateString || !getValidDate(fromDateString)) {
      return
    }
    const fromDate = getValidDate(fromDateString)!

    const inputMatchesRegex = regexArray.some((reg) => reg.test(toDateString))

    if (inputMatchesRegex && fromDate) {
      const numberOfDaysToAdd = parseDayCodes(toDateString)

      if (numberOfDaysToAdd) {
        //Befintliga webcert drar bort en dag i beräkningen
        const newDate = addDays(fromDate, numberOfDaysToAdd - 1)
        return formatDateToString(newDate)
      }
    } else if (_dateReg.test(toDateString) || _dateRegDashesOptional.test(toDateString)) {
      const newDate = getValidDate(toDateString)

      if (newDate) {
        return formatDateToString(newDate)
      }
    } else return null
  }

  const formatToInputTextField = () => {
    if (!toDateString || !fromDateString || !getValidDate(fromDateString)) {
      return
    }

    const fromDate = getValidDate(fromDateString)!

    const inputMatchesRegex = regexArray.some((reg) => reg.test(toDateString))

    if (inputMatchesRegex && fromDate) {
      const numberOfDaysToAdd = parseDayCodes(toDateString)

      if (numberOfDaysToAdd) {
        //Befintliga webcert drar bort en dag i beräkningen
        const newDate = addDays(fromDate, numberOfDaysToAdd - 1)
        setToDateString(formatDateToString(newDate))
      }
    } else if (_dateReg.test(toDateString) || _dateRegDashesOptional.test(toDateString)) {
      const newDate = getValidDate(toDateString)

      if (newDate) {
        setToDateString(formatDateToString(newDate))
      }
    }
  }

  const handleCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      tomTextInputRef.current?.focus()
      const fromDate = getPeriodStartingDate(periodId)
      setFromDateString(fromDate)
    } else {
      reset()
    }
  }

  const reset = () => {
    setFromDateString(null)
    setToDateString(null)
    setDisplayValidationError(false)
  }

  const getIsDisplayValidationError = (dateString: string | null) => {
    if (dateString && dateString.length > 0 && !getValidDate(dateString!)) return true

    return false
  }

  return (
    <>
      <DateRangeWrapper>
        <Checkbox
          id={`${periodId}-checkbox`}
          hasValidationError={false}
          disabled={false}
          value={'test'}
          wrapperStyles={checkBoxStyles}
          checked={dateChecked}
          onChange={handleCheckboxClick}
          label={label}
        />
        <DatesWrapper id="fromWrapper">
          <label htmlFor={`from${periodId}`}>Fr.o.m</label>
          <DatePickerCustom
            id={`from${periodId}`}
            textInputRef={fromTextInputRef}
            textInputOnBlur={handleFromTextInputOnBlur}
            textInputOnKeyDown={handleFromTextInputOnKeyDown}
            textInputName={`from${periodId}`}
            inputString={fromDateString}
            setDate={handleDatePickerSelectFrom}
            textInputOnChange={handleFromTextInputChange}
            textInputDataTestId={`from${periodId}`}
            displayValidationError={displayValidationError && getIsDisplayValidationError(fromDateString)}
          />
        </DatesWrapper>
        <DatesWrapper>
          <label htmlFor={`tom${periodId}`}>t.o.m</label>
          <DatePickerCustom
            id={`tom${periodId}`}
            textInputName={`tom${periodId}`}
            textInputRef={tomTextInputRef}
            inputString={toDateString}
            setDate={handleDatePickerSelectTo}
            textInputOnChange={handleToTextInputChange}
            textInputOnBlur={handleToTextInputOnBlur}
            textInputOnKeyDown={handleToTextInputOnKeyDown}
            textInputDataTestId={`tom${periodId}`}
            displayValidationError={displayValidationError && getIsDisplayValidationError(toDateString)}
          />
        </DatesWrapper>
      </DateRangeWrapper>
      {displayValidationError && <p>Ange datum i formatet åååå-mm-dd.</p>}
    </>
  )
}

export default DateRangePicker
