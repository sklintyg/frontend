import { fakeUncertainDateElement } from '@frontend/common'
import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../store/store'
import UeUncertainDate, { Props } from './UeUncertainDate'

export default {
  title: 'Webcert/UeUncertainDate',
  component: UeUncertainDate,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeUncertainDate {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: fakeUncertainDateElement({ id: '1' })['1'],
}
