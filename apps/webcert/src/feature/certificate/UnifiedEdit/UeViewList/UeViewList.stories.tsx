import { CertificateDataValueType, fakeViewListElement } from '@frontend/common'
import { Story } from '@storybook/react'
import faker from 'faker'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeViewList, { Props } from './UeViewList'

export default {
  title: 'Webcert/UeViewList',
  component: UeViewList,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeViewList {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
const mockQuestion = fakeViewListElement({
  id: '1',
  value: {
    list: [
      { type: CertificateDataValueType.VIEW_TEXT, text: faker.lorem.sentence(3) },
      { type: CertificateDataValueType.VIEW_TEXT, text: faker.lorem.sentence(3) },
      { type: CertificateDataValueType.VIEW_TEXT, text: faker.lorem.sentence(3) },
    ],
  },
})['1']
Default.args = {
  question: mockQuestion,
}
