import { fakeRadioBooleanElement } from '@frontend/common'
import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeRadio, { Props } from './UeRadio'

export default {
  title: 'Webcert/UeRadio',
  component: UeRadio,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeRadio {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: fakeRadioBooleanElement({
    id: '1',
    config: {
      selectedText: 'selected text',
      unselectedText: 'unselected text',
    },
  })['1'],
}
