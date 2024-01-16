import { Story } from '@storybook/react'
import React, { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeVisualAcuity from './UeVisualAcuity'
import { fakeVisualAcuityElement } from '../../../../faker'

export default {
  title: 'Webcert/UeVisualAcuity',
  component: UeVisualAcuity,
}

const Template: Story<ComponentProps<typeof UeVisualAcuity>> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeVisualAcuity {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: fakeVisualAcuityElement({ id: '1' })['1'],
}
