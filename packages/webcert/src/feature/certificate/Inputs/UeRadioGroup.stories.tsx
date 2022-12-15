import { fakeRadioMultipleCodeElement } from '@frontend/common'
import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../store/store'
import UeRadioGroup, { Props } from './UeRadioGroup'

export default {
  title: 'Webcert/UeRadioGroup',
  component: UeRadioGroup,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeRadioGroup {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: fakeRadioMultipleCodeElement({
    id: '1',
  })['1'],
}
