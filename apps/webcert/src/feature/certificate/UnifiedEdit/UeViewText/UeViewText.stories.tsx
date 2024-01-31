import { Story } from '@storybook/react'
import faker from 'faker'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeViewText, { Props } from './UeViewText'
import { fakeViewTextElement } from '../../../../faker'

export default {
  title: 'Webcert/UeViewText',
  component: UeViewText,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeViewText {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
const mockQuestion = fakeViewTextElement({
  id: '1',
  config: { label: faker.lorem.sentence(5) },
  value: { text: faker.lorem.sentence(5) },
})['1']
Default.args = {
  question: mockQuestion,
}
