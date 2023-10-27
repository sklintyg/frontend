import { fakeTextAreaElement } from '@frontend/common'
import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeTextArea, { Props } from './UeTextArea'

export default {
  title: 'Webcert/UeTextArea',
  component: UeTextArea,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeTextArea {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: fakeTextAreaElement({ id: '1' })['1'],
}
