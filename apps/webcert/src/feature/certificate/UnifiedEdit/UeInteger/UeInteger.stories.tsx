import { fakeIntegerElement } from '@frontend/common'
import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeInteger, { Props } from './UeInteger'

export default {
  title: 'Webcert/UeInteger',
  component: UeInteger,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeInteger {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: fakeIntegerElement({ id: '1' })['1'],
}
