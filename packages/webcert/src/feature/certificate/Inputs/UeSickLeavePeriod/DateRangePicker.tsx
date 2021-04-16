import React, { useEffect, useRef, useState } from 'react'
import DatePickerCustom from '../DatePickerCustom'
import { parse, addDays, differenceInCalendarDays, isEqual, isValid } from 'date-fns'
import ReactDatePicker from 'react-datepicker'
import colors from '../../../../components/styles/colors'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { useSelector, useDispatch } from 'react-redux'
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
  const tomTextInputRef = useRef<null | HTMLInputElement>(null)

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
    // dispatchUpdate(fromDateString, formatDateToString(date), questionId)
  }

  const handleDatePickerSelectTo = (date: Date) => {
    setToDateString(formatDateToString(date))
  }

  const handleToTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setToDateString(value)
  }

  const handleToTextInputOnBlur = () => {
    formatToInputTextField()
  }

  const handleToTextInputOnKeyDown = (event: React.KeyboardEvent) => {
    if (event.key.toLowerCase() === 'enter') {
      formatToInputTextField()
      tomTextInputRef.current?.blur()
    }
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
        // dispatchUpdate(fromDateString, formatDateToString(newDate), questionId)
      }
    } else if (_dateReg.test(toDateString) || _dateRegDashesOptional.test(toDateString)) {
      const newDate = getValidDate(toDateString)

      if (newDate) {
        setToDateString(formatDateToString(newDate))
        // dispatchUpdate(fromDateString, formatDateToString(newDate), questionId)
      }
    }
  }

  const handleCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      tomTextInputRef.current?.focus()
      const indexOfCurrentQuestion = (question.config.list as ConfigUeCheckboxDateRange[]).findIndex(
        (cfg) => cfg.id.toLowerCase() === questionId.toLowerCase()
      )
      if (indexOfCurrentQuestion > 0) {
        let maxDate: Date | undefined

        for (let i = 0; i < indexOfCurrentQuestion; i++) {
          const currPeriodId = (question.config.list as ConfigUeCheckboxDateRange[])[i].id
          const currPeriodValue = (question.value as ValueDateRangeList).list.find(
            (val) => val.id.toLowerCase() === currPeriodId.toLowerCase()
          )

          // const toDateString = (question.value as ValueDateRangeList).list[i]?.to
          // console.log('i, (question.value as ValueDateRangeList).list[i]?.to', i, (question.value as ValueDateRangeList).list[i]?.to)
          if (currPeriodValue?.to) {
            maxDate = getValidDate(currPeriodValue.to)
          }
        }

        if (maxDate) {
          //Adding 1 day to put the next period one day after prior period
          maxDate = addDays(maxDate, 1)
          setFromDateString(formatDateToString(maxDate))
        } else {
          setFromDateString(formatDateToString(new Date()))
        }

        // const priorValueIndex = indexOfCurrentQuestion - 1
        // const priorEndDateString = (question.value as ValueDateRangeList).list[priorValueIndex]?.to

        // if (!!priorEndDateString) {
        //   let fromDate = getValidDate(priorEndDateString)
        //   if (fromDate) {
        //     fromDate = addDays(fromDate, 1)
        //     setFromDateString(formatDateToString(fromDate))
        //   }
        // }
      } else {
        setFromDateString(formatDateToString(new Date()))
      }
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
          id={`${questionId}-checkbox`}
          hasValidationError={false}
          disabled={false}
          value={'test'}
          wrapperStyles={checkBoxStyles}
          checked={dateChecked}
          onChange={handleCheckboxClick}
          label={label}
        />
        <DatesWrapper id="fromWrapper">
          <label htmlFor={`from${questionId}`}>Fr.o.m</label>
          <DatePickerCustom
            id={`from${questionId}`}
            textInputName={`from${questionId}`}
            inputString={fromDateString}
            setDate={handleDatePickerSelectFrom}
            textInputOnChange={handleFromTextInputChange}
            textInputDataTestId={`from${questionId}`}
          />
        </DatesWrapper>
        <DatesWrapper>
          <label htmlFor={`tom${questionId}`}>t.o.m</label>
          <DatePickerCustom
            id={`tom${questionId}`}
            textInputName={`tom${questionId}`}
            textInputRef={tomTextInputRef}
            inputString={toDateString}
            setDate={handleDatePickerSelectTo}
            textInputOnChange={handleToTextInputChange}
            textInputOnBlur={handleToTextInputOnBlur}
            TextInputOnKeyDown={handleToTextInputOnKeyDown}
          />
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
