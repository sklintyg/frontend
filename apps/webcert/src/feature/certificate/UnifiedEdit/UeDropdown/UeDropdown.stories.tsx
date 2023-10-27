import { fakeDropdownElement } from '@frontend/common'
import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeDropdown, { Props } from './UeDropdown'

export default {
  title: 'Webcert/UeDropdown',
  component: UeDropdown,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeDropdown {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: fakeDropdownElement({ id: '1' })['1'],
}
