import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeDate, { Props } from './UeDate'
import { fakeDateElement } from '../../../../faker'

export default {
  title: 'Webcert/UeDate',
  component: UeDate,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeDate {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: fakeDateElement({ id: '1' })['1'],
}
