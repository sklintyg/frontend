import { fakeTypeaheadElement } from '@frontend/common'
import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeTypeahead, { Props } from './UeTypeahead'

export default {
  title: 'Webcert/UeTypeahead',
  component: UeTypeahead,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeTypeahead {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: fakeTypeaheadElement({ id: '1' })['1'],
}
