import { Button, makeStyles, TextField } from '@material-ui/core'
import React, { useRef, useState } from 'react'
import DatePickerCustom from './DatePickerCustom'
import { parse } from 'date-fns'
import ReactDatePicker from 'react-datepicker'

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
  wrapper: {
    display: 'flex',
  },
}))

const _dateReg = /[1-2][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/
const _dateRegDashesOptional = /[1-2][0-9]{3}-?(0[1-9]|1[0-2])-?(0[1-9]|[1-2][0-9]|3[0-1])/
const _format = 'YYYY-MM-DD'

const dayCodeReg = /^(?=\d*d\d*$)d?(?!0+d?$)(\d{1,3})d?$/i
const weekCodeReg = /^(?=\d*v\d*$)v?(?!0+v?$)(\d{1,3})v?$/i
const monthCodeReg = /^(?=\d*m\d*$)m?(?!0+m?$)(\d{1,2})m?$/i

const DateRangePicker = () => {
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)
  const classes = useStyles()
  const fromDateRef = useRef<ReactDatePicker | null>(null)
  const toDateRef = useRef(null)

  // const renderInput = (props: TextFieldProps): any => (
  //   <TextField type="text" onClick={props.onClick} value={props.value} onChange={props.onChange} />
  // )

  // const handleChange = (date: Date | [Date, Date] | null, event: React.SyntheticEvent<any, Event> | undefined) => {
  //   console.log('date', date)
  //   console.log(event)
  //   console.log('vi kör handleChange')

  //   // setSelectedDate(date as Date)
  //   setOpen(false)
  // }

  // const handleChangeRaw = (event: React.FocusEvent<HTMLInputElement>) => {
  //   console.log(event.target.value)
  // }

  function _parseDayCodes(input: string) {
    if (input && typeof input === 'string') {
      var result = dayCodeReg.exec(input)
      if (result && result.length > 0) {
        return parseInt(result[1], 10)
      }
      result = weekCodeReg.exec(input)
      if (result && result.length > 0) {
        return parseInt(result[1], 10) * 7
      }
      var months = _parseMonthCode(input)
      if (months) {
        return months * 31
      }
    }
    return null
  }

  function _parseMonthCode(input: string) {
    if (input && typeof input === 'string') {
      var result = monthCodeReg.exec(input)
      if (result && result.length > 0) {
        return parseInt(result[1], 10)
      }
    }
    return null
  }

  const handleFromTextInputChange = (event: React.FocusEvent<HTMLInputElement>) => {
    const { value } = event.target
    console.log(event.type)
    console.log('handleFromTextInputChange')

    console.log(event.target.value)
    if (event.target.value === '') {
      //TODO: Fixa så fokus inte släpps om man nullar datumet i statet

      setFromDate(null)
      return
    }

    const date = getValidDate(value)

    if (date) {
      console.log('setting from date', date)
      setFromDate(date)
    }
  }

  const handleToTextInputChange = (event: React.FocusEvent<HTMLInputElement>) => {
    const { value } = event.target

    if (_dateReg.test(value) || _dateRegDashesOptional.test(value)) {
      const date = getValidDate(value)

      if (date) {
        console.log('setting to date', date)
        setToDate(date)
      }
    }
  }

  const getValidDate = (dateString: string) => {
    if (_dateReg.test(dateString)) {
      const formattedString = dateString.replace(/-/g, '')
      return parse(formattedString, 'yyyyMMdd', new Date())
    } else if (_dateRegDashesOptional.test(dateString)) {
      return parse(dateString, 'yyyyMMdd', new Date())
    }
  }

  return (
    <div className={classes.wrapper}>
      <DatePickerCustom
        inputRef={fromDateRef}
        selectedDate={fromDate}
        setDate={(date) => setFromDate(date)}
        handleChangeRaw={handleFromTextInputChange}
      />
      <DatePickerCustom selectedDate={toDate} setDate={(date) => setToDate(date)} handleChangeRaw={handleToTextInputChange} />
    </div>
  )
}

export default DateRangePicker
