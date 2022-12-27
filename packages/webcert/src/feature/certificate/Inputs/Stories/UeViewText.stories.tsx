import { fakeViewTextElement } from '@frontend/common'
import { Story } from '@storybook/react'
import faker from 'faker'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeViewText, { Props } from '../UeViewText'

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
const mockQuestion = fakeViewTextElement({ id: '1', value: { text: faker.lorem.sentence(5) } })['1']
Default.args = {
  question: mockQuestion,
}
