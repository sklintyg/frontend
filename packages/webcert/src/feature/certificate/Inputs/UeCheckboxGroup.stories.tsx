import { fakeCheckboxMultipleCodeElement } from '@frontend/common'
import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../store/store'
import UeCheckboxGroup, { Props } from './UeCheckboxGroup'

export default {
  title: 'Webcert/UeCheckboxGroup',
  component: UeCheckboxGroup,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeCheckboxGroup {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: fakeCheckboxMultipleCodeElement({
    id: '1',
  })['1'],
}
