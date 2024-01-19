import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeTextField, { Props } from './UeTextField'
import { fakeTextFieldElement } from '../../../../faker'

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
