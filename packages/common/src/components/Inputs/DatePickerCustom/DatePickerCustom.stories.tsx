import { Story } from '@storybook/react'
import React, { useState } from 'react'
import DatePickerCustom, { Props } from './DatePickerCustom'

export default {
  title: 'Components/DatePickerCustom',
  component: DatePickerCustom,
}

const Template: Story<Props> = ({ textInputOnChange, inputString, setDate, displayValidationErrorOutline, ...args }) => {
  const [date, setDateState] = useState(inputString ?? '')
  const [isValid, setIsValidState] = useState(true)

  return (
    <DatePickerCustom
      setDate={(date) => {
        setDateState(date)
        setIsValidState(true)
        if (setDate) {
          setDate(date)
        }
      }}
      inputString={date}
      textInputOnChange={(value, isValid) => {
        console.log('textInputOnChange called with', value, isValid)
        setDateState(value)
        if (isValid != null && value !== '') {
          setIsValidState(isValid)
        }
        if (textInputOnChange) {
          textInputOnChange(value, isValid)
        }
      }}
      displayValidationErrorOutline={displayValidationErrorOutline == null ? !isValid : displayValidationErrorOutline}
      {...args}
    />
  )
}

export const Default = Template.bind({})
