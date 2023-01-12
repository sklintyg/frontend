import { CertificateDataValueType, fakeViewTableElement } from '@frontend/common'
import { Story } from '@storybook/react'
import faker from 'faker'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeViewTable, { Props } from './UeViewTable'

export default {
  title: 'Webcert/UeViewTable',
  component: UeViewTable,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeViewTable {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
const mockQuestion = fakeViewTableElement({
  id: '1',
  config: {
    columns: [
      { id: 'c1', text: faker.lorem.sentence(2) },
      { id: 'c2', text: faker.lorem.sentence(2) },
      { id: 'c3', text: faker.lorem.sentence(2) },
    ],
  },
  value: {
    rows: [
      {
        type: CertificateDataValueType.VIEW_ROW,
        columns: [
          { type: CertificateDataValueType.TEXT, id: 'c1', text: faker.lorem.word() },
          { type: CertificateDataValueType.TEXT, id: 'c2', text: faker.lorem.word() },
          { type: CertificateDataValueType.TEXT, id: 'c3', text: faker.lorem.word() },
        ],
      },
      {
        type: CertificateDataValueType.VIEW_ROW,
        columns: [
          { type: CertificateDataValueType.TEXT, id: 'c1', text: faker.lorem.word() },
          { type: CertificateDataValueType.TEXT, id: 'c2', text: faker.lorem.word() },
          { type: CertificateDataValueType.TEXT, id: 'c3', text: faker.lorem.word() },
        ],
      },
      {
        type: CertificateDataValueType.VIEW_ROW,
        columns: [
          { type: CertificateDataValueType.TEXT, id: 'c1', text: faker.lorem.word() },
          { type: CertificateDataValueType.TEXT, id: 'c2', text: faker.lorem.word() },
          { type: CertificateDataValueType.TEXT, id: 'c3', text: faker.lorem.word() },
        ],
      },
    ],
  },
})['1']
Default.args = {
  question: mockQuestion,
}
