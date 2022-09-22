import { fakeCheckboxBooleanElement } from '@frontend/common'
import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../store/store'
import UeCheckbox, { Props } from './UeCheckbox'

export default {
  title: 'Webcert/UeCheckbox',
  component: UeCheckbox,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeCheckbox {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: fakeCheckboxBooleanElement({ id: '1' })['1'],
}
