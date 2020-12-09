import { Button, Checkbox, FormControlLabel, makeStyles, TextField, Typography } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import DatePickerCustom from './DatePickerCustom'
import { parse, addDays, differenceInCalendarDays, format, isEqual, isValid } from 'date-fns'
import ReactDatePicker from 'react-datepicker'
import EmojiObjectsOutlinedIcon from '@material-ui/icons/EmojiObjectsOutlined'
import colors from '../../../components/styles/colors'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { useSelector, useDispatch } from 'react-redux'
import { CertificateDataElement, ValueDateRange, ValueDateRangeList } from '@frontend/common'
import _ from 'lodash'

const useStyles = makeStyles((theme) => ({
  buttonRoot: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    minWidth: 0,
    boxShadow: 'none',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderLeft: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.background.paper,
    },
  },
  startIcon: {
    margin: 0,
  },
  input: {
    boxSizing: 'border-box',
    height: theme.typography.pxToRem(38),
    maxWidth: theme.typography.pxToRem(130),
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  inputRoot: {
    borderRight: 0,
  },
  dateRangeWrapper: {
    display: 'flex',
    '&> *': {
      marginRight: theme.spacing(5),
    },
  },
  daysRangeWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    color: colors.IA_COLOR_05,
  },
  checked: {
    color: `${colors.IA_COLOR_05} !important`,
  },

  datesWrapper: {
    display: 'flex',
    alignItems: 'center',
    '& p': {
      marginRight: theme.spacing(1),
    },
  },
  checkboxRoot: {
    marginRight: 0,
  },
}))

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
  const classes = useStyles()
  const dispatch = useDispatch()
  const [dateChecked, setDateChecked] = useState((fromDate !== null && fromDate !== '') || (toDate !== null && toDate !== ''))
  const [fromDateString, setFromDateString] = useState<string | null>(fromDate)
  const [toDateString, setToDateString] = useState<string | null>(toDate)
  const [daysBetweenDates, setDaysBetweenDates] = useState<number | null>(null)

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
    if (previousFromDateString !== fromDateString || previousToDateString !== toDateString) {
      updateCheckbox()
      dispatchEditDraft(fromDateString, toDateString, questionId)
    }
  }, [fromDateString, toDateString])

  const dispatchEditDraft = useRef(
    _.debounce((fromDate: string | null, toDate: string | null, questionId: string) => {
      const updatedQuestion = getUpdatedValue(fromDate, toDate, questionId)
      dispatch(updateCertificateDataElement(updatedQuestion))
    }, 1000)
  ).current

  if (!question) return null

  const getUpdatedValue = (fromDate: string | null, toDate: string | null, questionId: string) => {
    const updatedQuestion: CertificateDataElement = { ...question }

    const updatedQuestionValue = { ...(updatedQuestion.value as ValueDateRangeList) }
    let updatedValueList = [...(updatedQuestionValue.list as ValueDateRange[])]

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

  const updateCheckbox = () => {
    if (fromDateString || toDateString) {
      setDateChecked(true)
    } else {
      setDateChecked(false)
    }
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
      console.log('setting from date', updatedFromDate)
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
        // updateDaysBetween(fromDate, newDate)
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

  const updateDaysBetween = (startDate: Date, endDate: Date) => {
    const days = calculcateDifferenceInCalendarDays(startDate, endDate)

    if (days > 0) {
      //Befintliga webcert lägger till 1 dag
      setDaysBetweenDates(days + 1)
    }
  }

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

  const handleCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      setFromDateString(format(new Date(), _format))
    } else {
      reset()
    }

    // setDateChecked(checked)
    // dispatchUpdate(format(new Date(), _format), toDateString, questionId)
  }

  const reset = () => {
    setFromDateString(null)
    setToDateString(null)
    setDaysBetweenDates(null)
  }

  return (
    <>
      <div className={classes.dateRangeWrapper}>
        <div>
          <FormControlLabel
            control={<Checkbox classes={{ checked: classes.checked }} checked={dateChecked} onChange={handleCheckboxClick} />}
            label={label}
          />
        </div>
        <div className={classes.datesWrapper}>
          <Typography>Fr.o.m</Typography>
          <DatePickerCustom inputString={fromDateString} setDate={handleDatePickerSelectFrom} handleTextInput={handleFromTextInputChange} />
        </div>
        <div className={classes.datesWrapper}>
          <Typography>t.o.m</Typography>
          <DatePickerCustom
            inputString={toDateString}
            setDate={handleDatePickerSelectTo}
            selectedDate={new Date()}
            handleTextInput={handleToTextInputChange}
          />
        </div>
      </div>
      {daysBetweenDates && (
        <div className={classes.daysRangeWrapper}>
          <EmojiObjectsOutlinedIcon />
          <Typography>Intyget motsvarar en period på {daysBetweenDates} dagar.</Typography>
        </div>
      )}
    </>
  )
}

export default DateRangePicker

const parseDate = (dateString: string) => {
  return parse(dateString, _parseformat, new Date())
}
