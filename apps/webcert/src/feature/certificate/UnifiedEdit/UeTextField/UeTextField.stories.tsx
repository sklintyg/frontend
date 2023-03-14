import { fakeTextFieldElement } from '@frontend/common'
import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeTextField, { Props } from './UeTextField'

export default {
  title: 'Webcert/UeTextField',
  component: UeTextField,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeTextField {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: fakeTextFieldElement({ id: '1' })['1'],
}
