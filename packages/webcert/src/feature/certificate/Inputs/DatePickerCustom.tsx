import { Button, makeStyles, TextField } from '@material-ui/core'
import React, { useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import DateRangeIcon from '@material-ui/icons/DateRange'

const useStyles = makeStyles((theme) => ({
  day: {
    border: '5px solid red',
  },
  buttonRoot: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    minWidth: 0,
    '& :hover': {
      backgroundColor: theme.palette.primary.light,
    },
  },
  startIcon: {
    margin: 0,
  },
}))

const _dateReg = /[1-2][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/
const _dateRegDashesOptional = /[1-2][0-9]{3}-?(0[1-9]|1[0-2])-?(0[1-9]|[1-2][0-9]|3[0-1])/
const _format = 'YYYY-MM-DD'

const dayCodeReg = /^(?=\d*d\d*$)d?(?!0+d?$)(\d{1,3})d?$/i
const weekCodeReg = /^(?=\d*v\d*$)v?(?!0+v?$)(\d{1,3})v?$/i
const monthCodeReg = /^(?=\d*m\d*$)m?(?!0+m?$)(\d{1,2})m?$/i

const DatePickerCustom = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const classes = useStyles()
  const [open, setOpen] = useState(false)

  const calendarRef = useRef(null)

  // const renderInput = (props: TextFieldProps): any => (
  //   <TextField type="text" onClick={props.onClick} value={props.value} onChange={props.onChange} />
  // )

  const Input = ({ onChange, placeholder, value, isSecure, id, onClick }: any) => (
    <>
      <TextField onChange={onChange} placeholder="åååå-mm-dd" value={value} id={id} onClick={onClick} />
      <Button
        classes={{ root: classes.buttonRoot, startIcon: classes.startIcon }}
        onClick={() => setOpen(true)}
        variant="contained"
        color="secondary"
        startIcon={<DateRangeIcon classes={{}} />}></Button>
    </>
  )

  const handleChange = (date: Date | [Date, Date] | null, event: React.SyntheticEvent<any, Event> | undefined) => {
    console.log('date', date)
    console.log(event)
    console.log('vi kör handleChange')

    // setSelectedDate(date as Date)
    setOpen(false)
  }

  const handleChangeRaw = (event: React.FocusEvent<HTMLInputElement>) => {
    console.log(event.target.value)
  }

  function _parseDayCodes(input: string) {
    if (input) {
      var result = dayCodeReg.exec(input)
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

  return (
    <div>
      <DatePicker
        dateFormat="yyyy-MM-dd"
        customInput={<Input />}
        onChangeRaw={(e) => handleChangeRaw(e)}
        onClickOutside={() => setOpen(false)}
        open={open}
        ref={calendarRef}
        selected={selectedDate}
        onChange={(date, event) => handleChange(date, event)}
        showWeekNumbers
      />
      {}
    </div>
  )
}

const TestInput = () => {
  return <TextField></TextField>
}

export default DatePickerCustom
