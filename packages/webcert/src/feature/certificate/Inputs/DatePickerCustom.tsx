import { makeStyles, TextField, Button } from '@material-ui/core'
import React, { ClassAttributes, useState } from 'react'
import DateRangeIcon from '@material-ui/icons/DateRange'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ReactDatePicker from 'react-datepicker'
import colors from '../../../components/styles/colors'
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
      backgroundColor: colors.IA_COLOR_05,
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
}))

interface Props {
  handleChangeRaw?: (event: React.FocusEvent<HTMLInputElement>) => void
  setDate: (date: Date) => void
  selectedDate: Date | null
  inputRef?: any
  wrapperClass?: string
  inputValue?: Date | null | string
}

const DatePickerCustom: React.FC<Props> = ({ setDate, handleChangeRaw, selectedDate, inputRef, wrapperClass, inputValue }) => {
  const [open, setOpen] = useState(false)
  //   const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const classes = useStyles()

  let inputString: string

  if (inputValue && inputValue instanceof Date) {
    inputString = format(inputValue, 'yyyy-MM-dd')
  } else {
    inputString = inputValue as string
  }

  // {
  //   /* <TextField
  //     key="test"
  //     ref={inputRef}
  //     InputProps={{
  //       classes: {
  //         root: classes.inputRoot,
  //       },
  //       className: classes.input,
  //     }}
  //     variant="outlined"
  //     onChange={onChange}
  //     placeholder="åååå-mm-dd"
  //     value={value}
  //     id={id}
  //     onClick={onClick}
  //   /> */
  // }

  const Input = ({ onChange, value, id, onClick }: any) => (
    <>
      <input
        type="text"
        ref={inputRef}
        onChange={handleChangeRaw}
        placeholder="åååå-mm-dd"
        value={inputValue ? inputString : value}
        id={id}
        key="hejsan"
        onClick={onClick}
      />
      <Button
        classes={{ root: classes.buttonRoot, startIcon: classes.startIcon }}
        onClick={() => setOpen(true)}
        variant="contained"
        color="secondary"
        startIcon={<DateRangeIcon />}></Button>
    </>
  )

  return (
    <div className={wrapperClass}>
      <DatePicker
        shouldCloseOnSelect={true}
        onChange={() => {}}
        dateFormat="yyyy-MM-dd"
        customInput={
          <>
            <input
              type="text"
              ref={inputRef}
              onChange={handleChangeRaw}
              placeholder="åååå-mm-dd"
              value={inputValue ? inputString : selectedDate?.toString()}
            />
            <Button
              classes={{ root: classes.buttonRoot, startIcon: classes.startIcon }}
              onClick={() => setOpen(true)}
              variant="contained"
              color="secondary"
              startIcon={<DateRangeIcon />}></Button>
          </>
        }
        onChangeRaw={(e) => handleChangeRaw && handleChangeRaw(e)}
        onClickOutside={() => setOpen(false)}
        open={open}
        selected={selectedDate}
        onSelect={(date: any, event: any) => {
          setOpen(false)
          setDate(date)
        }}
        showWeekNumbers
      />
    </div>
  )
}

// const _dateReg = /[1-2][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/
// const _dateRegDashesOptional = /[1-2][0-9]{3}-?(0[1-9]|1[0-2])-?(0[1-9]|[1-2][0-9]|3[0-1])/
// const _format = 'YYYY-MM-DD'

// const dayCodeReg = /^(?=\d*d\d*$)d?(?!0+d?$)(\d{1,3})d?$/i
// const weekCodeReg = /^(?=\d*v\d*$)v?(?!0+v?$)(\d{1,3})v?$/i
// const monthCodeReg = /^(?=\d*m\d*$)m?(?!0+m?$)(\d{1,2})m?$/i

export default DatePickerCustom
