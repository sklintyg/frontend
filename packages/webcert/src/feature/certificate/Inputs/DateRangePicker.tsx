import { Button, Checkbox, FormControlLabel, makeStyles, TextField, Typography } from '@material-ui/core'
import React, { useRef, useState } from 'react'
import DatePickerCustom from './DatePickerCustom'
import { parse, addDays, differenceInCalendarDays, format, isEqual, isValid } from 'date-fns'
import ReactDatePicker from 'react-datepicker'
import EmojiObjectsOutlinedIcon from '@material-ui/icons/EmojiObjectsOutlined'
import colors from '../../../components/styles/colors'
import { setTextRange } from 'typescript'

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

const dayCodeReg = /^(?=\d*d\d*$)d?(?!0+d?$)(\d{1,3})d?$/i
const weekCodeReg = /^(?=\d*v\d*$)v?(?!0+v?$)(\d{1,3})v?$/i
const monthCodeReg = /^(?=\d*m\d*$)m?(?!0+m?$)(\d{1,2})m?$/i

const regexArray = [dayCodeReg, weekCodeReg, monthCodeReg]

interface Props {
  label: string
}

const DateRangePicker: React.FC<Props> = ({ label }) => {
  const classes = useStyles()
  const [dateChecked, setChecked] = useState(false)
  const [fromDateString, setFromDateString] = useState<string | null>(null)
  const [toDateString, setToDateString] = useState<string | null>(null)
  const [daysBetweenDates, setDaysBetweenDates] = useState<number | null>(null)
  const fromDateRef = useRef<ReactDatePicker | null>(null)
  const toDateRef = useRef<HTMLDivElement | null>(null)

  function _parseDayCodes(input: string) {
    if (input && typeof input === 'string') {
      let result = dayCodeReg.exec(input)
      if (result && result.length > 0) {
        return parseInt(result[1], 10)
      }
      result = weekCodeReg.exec(input)
      if (result && result.length > 0) {
        return parseInt(result[1], 10) * 7
      }
      const months = _parseMonthCode(input)
      if (months) {
        return months * 31
      }
    }
    return null
  }

  function _parseMonthCode(input: string) {
    if (input && typeof input === 'string') {
      const result = monthCodeReg.exec(input)
      if (result && result.length > 0) {
        return parseInt(result[1], 10)
      }
    }
    return null
  }

  const handleFromTextInputChange = (event: any) => {
    const { value } = event.target
    setFromDateString(value ?? null)
    //TODO: Denna verkar triggas när man väljer i menyn också. Nedan check borde lösa detta
    if (!value) {
      return
    }
    console.log(event.type)
    console.log('handleFromTextInputChange')

    console.log(event.target.value)
    // if (event.target.value === '') {
    //   //TODO: Fixa så fokus inte släpps om man nullar datumet i statet

    //   setFromDate(null)
    //   return
    // }

    const date = getValidDate(value)

    if (isValid(date)) {
      console.log('setting from date', date)
      const dateString = format(date!, _format)
      setFromDateString(dateString)

      if (toDateString) {
        // calculcateDifferenceInCalendarDays(date, toDate)
      }
    }
  }

  const handleDatePickerSelectFrom = (date: Date) => {
    setFromDateString(format(date, _format))
  }

  const handleDatePickerSelectTo = (date: Date) => {
    setToDateString(format(date, _format))
  }

  const handleToTextInputChange = (event: React.FocusEvent<HTMLInputElement>) => {
    const { value } = event.target
    setToDateString(value)

    console.log('value', value)

    if (!value || !fromDateString || !getValidDate(fromDateString)) {
      return
    }

    const fromDate = getValidDate(fromDateString)!

    //TODO: Om man skriver tex 1v och sen 1v igen så står 1v kvar. något med att det är samma datum?
    const inputMatchesRegex = regexArray.some((reg) => reg.test(value))

    if (inputMatchesRegex && fromDate) {
      const numberOfDaysToAdd = _parseDayCodes(value)

      if (numberOfDaysToAdd) {
        //Befintliga webcert drar bort en dag i beräkningen
        const newDate = addDays(fromDate, numberOfDaysToAdd - 1)
        setToDateString(format(newDate, _format))
        updateDaysBetween(fromDate, newDate)
      }
    } else if (_dateReg.test(value) || _dateRegDashesOptional.test(value)) {
      const newDate = getValidDate(value)

      if (newDate) {
        setToDateString(format(newDate, _format))
        updateDaysBetween(fromDate, newDate)
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
      return parse(formattedString, 'yyyyMMdd', new Date())
    } else if (_dateRegDashesOptional.test(dateString)) {
      return parse(dateString, 'yyyyMMdd', new Date())
    }
  }

  const handleCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      setFromDateString(format(new Date(), _format))
    } else {
      reset()
    }

    setChecked(checked)
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
            inputRef={toDateRef}
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
