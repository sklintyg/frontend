import React, { useEffect, useRef, useState } from 'react'
import DatePickerCustom from '../DatePickerCustom'
import { parse, addDays, differenceInCalendarDays, format, isEqual, isValid } from 'date-fns'
import ReactDatePicker from 'react-datepicker'
import colors from '../../../../components/styles/colors'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { useSelector, useDispatch } from 'react-redux'
import { CertificateDataElement, ValueDateRange, ValueDateRangeList } from '@frontend/common'
import _ from 'lodash'
import styled, { css } from 'styled-components/macro'
import { Checkbox } from '@frontend/common'
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
const _format = 'yyyy-MM-dd'
const _parseformat = 'yyyyMMdd'

const dayCodeReg = /^(?=\d*d\d*$)d?(?!0+d?$)(\d{1,3})d?$/i
const weekCodeReg = /^(?=\d*v\d*$)v?(?!0+v?$)(\d{1,3})v?$/i
const monthCodeReg = /^(?=\d*m\d*$)m?(?!0+m?$)(\d{1,2})m?$/i

const regexArray = [dayCodeReg, weekCodeReg, monthCodeReg]

interface Props {
  label: string
  questionId: string
  question: CertificateDataElement
  fromDate: string | null
  toDate: string | null
}

const DateRangePicker: React.FC<Props> = ({ label, question, questionId, fromDate, toDate }) => {
  const dispatch = useDispatch()
  const [dateChecked, setDateChecked] = useState((fromDate !== null && fromDate !== '') || (toDate !== null && toDate !== ''))
  const [fromDateString, setFromDateString] = useState<string | null>(fromDate)
  const [toDateString, setToDateString] = useState<string | null>(toDate)
  // const [daysBetweenDates, setDaysBetweenDates] = useState<number | null>(null)

  function usePrevious(value: any) {
    const ref = React.useRef(value)

    React.useEffect(() => {
      ref.current = value
    })

    return ref.current
  }

  const previousFromDateString = usePrevious(fromDateString)
  const previousToDateString = usePrevious(toDateString)

  const dispatchEditDraft = useRef(
    _.debounce((fromDate: string | null, toDate: string | null, questionId: string) => {
      const updatedQuestion = getUpdatedValue(fromDate, toDate, questionId)
      dispatch(updateCertificateDataElement(updatedQuestion))
    }, 1000)
  ).current

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
      dispatchEditDraft(fromDateString, toDateString, questionId)
    }
  }, [dispatchEditDraft, fromDateString, previousFromDateString, previousToDateString, questionId, toDateString])

  if (!question) return null

  const getUpdatedValue = (fromDate: string | null, toDate: string | null, questionId: string) => {
    const updatedQuestion: CertificateDataElement = { ...question }

    const updatedQuestionValue = { ...(updatedQuestion.value as ValueDateRangeList) }
    let updatedValueList = [...updatedQuestionValue.list]

    const updatedValueIndex = updatedValueList.findIndex((val) => val.id === questionId)

    if (updatedValueIndex === -1) {
      updatedValueList = [...updatedValueList, { from: fromDate, to: toDate, id: questionId } as ValueDateRange]
    } else {
      updatedValueList = updatedValueList.map((val) => {
        if (val.id === questionId) {
          return { ...val, from: fromDate, to: toDate, id: questionId } as ValueDateRange
        }
        return val
      })
    }
    updatedQuestionValue.list = updatedValueList
    updatedQuestion.value = updatedQuestionValue

    return updatedQuestion
  }

  function parseDayCodes(input: string) {
    if (input && typeof input === 'string') {
      let result = dayCodeReg.exec(input)
      if (result && result.length > 0) {
        return parseInt(result[1], 10)
      }
      result = weekCodeReg.exec(input)
      if (result && result.length > 0) {
        return parseInt(result[1], 10) * 7
      }
      const months = parseMonthCode(input)
      if (months) {
        return months * 31
      }
    }
    return null
  }

  function parseMonthCode(input: string) {
    if (input && typeof input === 'string') {
      const result = monthCodeReg.exec(input)
      if (result && result.length > 0) {
        return parseInt(result[1], 10)
      }
    }
    return null
  }

  const handleFromTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setFromDateString(value ?? null)

    if (!value) {
      return
    }

    const updatedFromDate = getValidDate(value)

    if (isValid(updatedFromDate)) {
      const dateString = format(updatedFromDate!, _format)
      setFromDateString(dateString)

      if (toDateString) {
        calculcateDifferenceInCalendarDays(updatedFromDate!, parseDate(toDateString))
      }
    }
  }

  const handleDatePickerSelectFrom = (date: Date) => {
    setFromDateString(format(date, _format))
    // dispatchUpdate(fromDateString, format(date, _format), questionId)
  }

  const handleDatePickerSelectTo = (date: Date) => {
    setToDateString(format(date, _format))
  }

  const handleToTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setToDateString(value)

    console.log('value', value)

    if (!value || !fromDateString || !getValidDate(fromDateString)) {
      return
    }

    const fromDate = getValidDate(fromDateString)!

    const inputMatchesRegex = regexArray.some((reg) => reg.test(value))

    if (inputMatchesRegex && fromDate) {
      const numberOfDaysToAdd = parseDayCodes(value)

      if (numberOfDaysToAdd) {
        //Befintliga webcert drar bort en dag i beräkningen
        const newDate = addDays(fromDate, numberOfDaysToAdd - 1)
        setToDateString(format(newDate, _format))
        // updateDaysBetween(newDate, fromDate)
        // dispatchUpdate(fromDateString, format(newDate, _format), questionId)
      }
    } else if (_dateReg.test(value) || _dateRegDashesOptional.test(value)) {
      const newDate = getValidDate(value)

      if (newDate) {
        setToDateString(format(newDate, _format))
        // updateDaysBetween(fromDate, newDate)
        // dispatchUpdate(fromDateString, format(newDate, _format), questionId)
      }
    }
  }

  // const updateDaysBetween = (startDate: Date, endDate: Date) => {
  //   const days = calculcateDifferenceInCalendarDays(startDate, endDate)

  //   if (days > 0) {
  //     //Befintliga webcert lägger till 1 dag
  //     setDaysBetweenDates(days + 1)
  //   }
  // }

  const calculcateDifferenceInCalendarDays = (startDate: Date, endDate: Date) => {
    return differenceInCalendarDays(startDate, endDate)
  }

  const getValidDate = (dateString: string) => {
    if (_dateReg.test(dateString)) {
      const formattedString = dateString.replace(/-/g, '')
      return parse(formattedString, _parseformat, new Date())
    } else if (_dateRegDashesOptional.test(dateString)) {
      return parse(dateString, _parseformat, new Date())
    }
  }

  const handleCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setFromDateString(format(new Date(), _format))
    } else {
      reset()
    }
  }

  const reset = () => {
    setFromDateString(null)
    setToDateString(null)
    // setDaysBetweenDates(null)
  }

  return (
    <>
      <DateRangeWrapper>
        <Checkbox
          id={questionId}
          hasValidationError={false}
          disabled={false}
          value={'test'}
          wrapperStyles={checkBoxStyles}
          checked={dateChecked}
          onChange={handleCheckboxClick}
          label={label}
        />
        <DatesWrapper id="fromWrapper">
          <p>Fr.o.m</p>
          <DatePickerCustom inputString={fromDateString} setDate={handleDatePickerSelectFrom} handleTextInput={handleFromTextInputChange} />
        </DatesWrapper>
        <DatesWrapper>
          <p>t.o.m</p>
          <DatePickerCustom inputString={toDateString} setDate={handleDatePickerSelectTo} handleTextInput={handleToTextInputChange} />
        </DatesWrapper>
      </DateRangeWrapper>
      {/* {daysBetweenDates && (
        <DaysRangeWrapper>
          <FontAwesomeIcon icon={faLightbulb} />
          <p>Intyget motsvarar en period på {daysBetweenDates} dagar.</p>
        </DaysRangeWrapper>
      )} */}
    </>
  )
}

export default DateRangePicker

const parseDate = (dateString: string) => {
  return parse(dateString, _parseformat, new Date())
}
