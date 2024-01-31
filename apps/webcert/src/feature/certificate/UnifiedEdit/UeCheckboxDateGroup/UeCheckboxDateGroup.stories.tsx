import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeCheckboxDateGroup, { Props } from './UeCheckboxDateGroup'
import { fakeCheckboxMultipleDate } from '../../../../faker'

export default {
  title: 'Webcert/UeCheckboxDateGroup',
  component: UeCheckboxDateGroup,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeCheckboxDateGroup {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: fakeCheckboxMultipleDate({ id: '1' })['1'],
}
