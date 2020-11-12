import { Button, makeStyles, TextField } from '@material-ui/core'
import React, { useRef, useState } from 'react'
import DatePickerCustom from './DatePickerCustom'
import { format } from 'date-fns'

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
    if (input) {
      let result = dayCodeReg.exec(input)
      if (result && result.length > 0) {
        return parseInt(result[1], 10)
      }
      result = weekCodeReg.exec(input)
      if (result && result.length > 0) {
        return parseInt(result[1], 10) * 7
      }
      // var months = _parseMonthCode(input)
      // if (months) {
      //   return months * 31
      // }
    }
    return null
  }

  const parseDayCodes = (input: string) => {
    // if(!input) return null

    if (dayCodeReg.test(input)) {
      return
    }
  }

  const handleFromTextInputChange = (event: React.FocusEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    if (_dateRegDashesOptional.test(event.target.value)) {
      console.log('datum korrekt, sätter datumet till selectedDate. event.target.value:', event.target.value)
      //TODO: 20201011 funkar inte, behövs dashes '-'. Fix
      const crash = Date.parse(event.target.value)
      console.log(crash)
    }
  }

  const handleToTextInputChange = (event: React.FocusEvent<HTMLInputElement>) => {
    if (_dateRegDashesOptional.test(event.target.value)) {
      console.log('datum korrekt, sätter datumet till selectedDate. event.target.value:', event.target.value)
      setToDate(new Date(event.target.value))
    }
  }

  return (
    <div className={classes.wrapper}>
      <DatePickerCustom selectedDate={fromDate} setDate={(date) => setFromDate(date)} handleChangeRaw={handleFromTextInputChange} />
      <DatePickerCustom selectedDate={toDate} setDate={(date) => setToDate(date)} handleChangeRaw={handleToTextInputChange} />
    </div>
  )
}

export default DateRangePicker
