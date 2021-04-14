import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format, parse } from 'date-fns'
import styled from 'styled-components/macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarWeek } from '@fortawesome/free-solid-svg-icons'

const Wrapper = styled.div`
  display: flex;
`

const StyledButton = styled.button`
  padding: 8px !important;
  min-width: 0;
  box-shadow: none;
  border: 1px solid rgba(0; 0; 0; 0.23);
  border-left: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`

const TextInput = styled.input`
  padding: 0 0.5rem !important;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  max-width: 13ch;
`

interface Props {
  setDate: (date: Date) => void
  inputString: string | null
  handleTextInput: (event: React.ChangeEvent<HTMLInputElement>) => void
  id?: string
}

const _dateReg = /[1-2][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/
const _dateRegDashesOptional = /[1-2][0-9]{3}-?(0[1-9]|1[0-2])-?(0[1-9]|[1-2][0-9]|3[0-1])/
const _format = 'yyyy-MM-dd'

const DatePickerCustom: React.FC<Props> = ({ setDate, inputString, handleTextInput, id }) => {
  const [open, setOpen] = useState(false)

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

  return (
    <Wrapper>
      <TextInput
        id={id}
        type="text"
        maxLength={10}
        className="ic-textfield"
        onChange={handleTextInput}
        placeholder="åååå-mm-dd"
        value={inputString ? inputString : ''}
      />
      <DatePicker
        shouldCloseOnSelect={true}
        onChange={() => {
          /*Empty*/
        }}
        dateFormat={_format}
        customInput={
          <StyledButton onClick={() => setOpen(true)} className="ic-button" onClickCapture={() => setOpen(true)}>
            <FontAwesomeIcon icon={faCalendarWeek} size="lg" />
          </StyledButton>
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
    </Wrapper>
  )
}

export default DatePickerCustom
