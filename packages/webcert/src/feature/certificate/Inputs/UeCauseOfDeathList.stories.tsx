import { fakeCauseOfDeathListElement } from '@frontend/common'
import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../store/store'
import UeCauseOfDeathList, { Props } from './UeCauseOfDeathList'

export default {
  title: 'Webcert/UeCauseOfDeathList',
  component: UeCauseOfDeathList,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeCauseOfDeathList {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: fakeCauseOfDeathListElement({ id: '1' })['1'],
}
