import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeYear, { Props } from './UeYear'
import { fakeYearElement } from '../../../../faker'

export default {
  title: 'Webcert/UeYear',
  component: UeYear,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeYear {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: fakeYearElement({ id: '1', value: { year: 2021 } })['1'],
}
