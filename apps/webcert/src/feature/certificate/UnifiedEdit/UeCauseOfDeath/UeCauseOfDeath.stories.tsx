import { Story } from '@storybook/react'
import React, { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeCauseOfDeath from './UeCauseOfDeath'
import { fakeCauseOfDeathElement } from '../../../../faker'

export default {
  title: 'Webcert/UeCauseOfDeath',
  component: UeCauseOfDeath,
}

const Template: Story<ComponentProps<typeof UeCauseOfDeath>> = ({ ...args }) => {
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
