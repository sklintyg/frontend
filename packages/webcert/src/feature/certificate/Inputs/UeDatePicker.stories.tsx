import { fakeDatePickerElement } from '@frontend/common'
import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../store/store'
import UeDatePicker, { Props } from './UeDatePicker'

export default {
  title: 'Webcert/UeDatePicker',
  component: UeDatePicker,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeDatePicker {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: fakeDatePickerElement({ id: '1' })['1'],
}
