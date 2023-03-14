import { fakeDateRangeElement } from '@frontend/common'
import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeDateRange, { Props } from './UeDateRange'

export default {
  title: 'Webcert/UeDateRange',
  component: UeDateRange,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeDateRange {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: fakeDateRangeElement({ id: '1' })['1'],
}
