// import { makeStyles, TextField, Button } from '@material-ui/core'
import React, { ClassAttributes, useState } from 'react'
// import DateRangeIcon from '@material-ui/icons/DateRange'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ReactDatePicker from 'react-datepicker'
import colors from '../../../components/styles/colors'
import { format, parse } from 'date-fns'
import styled from "styled-components/macro";

// const useStyles = makeStyles((theme) => ({
//   buttonRoot: {
//     color: theme.palette.text.primary,
//     backgroundColor: theme.palette.background.paper,
//     padding: theme.spacing(1),
//     minWidth: 0,
//     boxShadow: 'none',
//     border: '1px solid rgba(0, 0, 0, 0.23)',
//     borderLeft: 0,
//     borderTopLeftRadius: 0,
//     borderBottomLeftRadius: 0,
//     '&:hover': {
//       backgroundColor: colors.IA_COLOR_05,
//       color: theme.palette.background.paper,
//     },
//   },
//   startIcon: {
//     margin: 0,
//   },
//   input: {
//     boxSizing: 'border-box',
//     height: theme.typography.pxToRem(38),
//     maxWidth: theme.typography.pxToRem(130),
//     borderTopRightRadius: 0,
//     borderBottomRightRadius: 0,
//   },
//   inputRoot: {
//     borderRight: 0,
//   },
// }))

const StyledButton = styled.button`
  
`

interface Props {
  setDate: (date: Date) => void
  selectedDate?: Date
  wrapperClass?: string
  inputString: string | null
  handleTextInput: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const _dateReg = /[1-2][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/
const _dateRegDashesOptional = /[1-2][0-9]{3}-?(0[1-9]|1[0-2])-?(0[1-9]|[1-2][0-9]|3[0-1])/
const _format = 'yyyy-MM-dd'

const DatePickerCustom: React.FC<Props> = ({ setDate, selectedDate, wrapperClass, inputString, handleTextInput }) => {
  const [open, setOpen] = useState(false)
  //   const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  // const classes = useStyles()

  // const validateDate = (dateString: string) => {
  //   return getValidDate
  // }

  let date: Date

  const getValidDate = (dateString: string) => {
    if (_dateReg.test(dateString)) {
      const formattedString = dateString.replace(/-/g, '')
      return parse(formattedString, 'yyyyMMdd', new Date())
    } else if (_dateRegDashesOptional.test(dateString)) {
      return parse(dateString, 'yyyyMMdd', new Date())
    }

    return new Date()
  }

  if (inputString) {
    date = getValidDate(inputString)
  } else {
    date = new Date()
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

  // const Input = ({ onChange, value, id, onClick }: any) => (
  //   <>
  //     <input
  //       type="text"
  //       ref={inputRef}
  //       onChange={handleChangeRaw}
  //       placeholder="åååå-mm-dd"
  //       value={inputString ? inputString : value}
  //       id={id}
  //       key="hejsan"
  //       onClick={onClick}
  //     />
  //     <Button
  //       classes={{ root: classes.buttonRoot, startIcon: classes.startIcon }}
  //       onClick={() => setOpen(true)}
  //       variant="contained"
  //       color="secondary"
  //       startIcon={<DateRangeIcon />}></Button>
  //   </>
  // )

  return (
    <div className={wrapperClass}>
      <input maxLength={10} type="text" onChange={handleTextInput} placeholder="åååå-mm-dd" value={inputString ? inputString : ''} />
      <DatePicker
        shouldCloseOnSelect={true}
        onChange={() => {}}
        dateFormat={_format}
        customInput={
          <Button
            classes={{ root: classes.buttonRoot, startIcon: classes.startIcon }}
            onClick={() => setOpen(true)}
            variant="contained"
            color="secondary"
            onClickCapture={() => setOpen(true)}
            startIcon={<DateRangeIcon />}></Button>
        }
        onClickOutside={() => setOpen(false)}
        open={open}
        selected={date}
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
