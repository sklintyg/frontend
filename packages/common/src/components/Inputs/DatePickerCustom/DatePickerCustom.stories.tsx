import { Story } from '@storybook/react'
import React, { ComponentProps, useState } from 'react'
import DatePickerCustom from './DatePickerCustom'

export default {
  title: 'Components/DatePickerCustom',
  component: DatePickerCustom,
}

const Template: Story<ComponentProps<typeof DatePickerCustom>> = ({
  textInputOnChange,
  inputString,
  setDate,
  displayValidationErrorOutline,
  ...args
}) => {
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
