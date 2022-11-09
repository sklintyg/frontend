import { fakeCauseOfDeathElement } from '@frontend/common'
import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../store/store'
import UeCauseOfDeath, { Props } from './UeCauseOfDeath'

export default {
  title: 'Webcert/UeCauseOfDeath',
  component: UeCauseOfDeath,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeCauseOfDeath {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: fakeCauseOfDeathElement({ id: '1' })['1'],
}
