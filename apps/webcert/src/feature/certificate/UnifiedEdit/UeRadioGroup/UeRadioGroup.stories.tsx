import { Story } from '@storybook/react'
import faker from 'faker'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeRadioGroup, { Props } from './UeRadioGroup'
import { fakeRadioMultipleCodeElement } from '../../../../faker'
import { ConfigLayout } from '../../../../types'

export default {
  title: 'Webcert/UeRadioGroup',
  component: UeRadioGroup,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeRadioGroup {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: fakeRadioMultipleCodeElement({
    id: '1',
  })['1'],
}

export const Inline = Template.bind({})
Inline.args = {
  question: fakeRadioMultipleCodeElement({
    config: {
      layout: ConfigLayout.INLINE,
      list: Array.from({ length: 5 }, () => ({
        id: faker.random.alpha({ count: 10 }),
        label: faker.lorem.word(3).toUpperCase(),
      })),
    },
    id: '1',
  })['1'],
}

export const Columns = Template.bind({})
Columns.args = {
  question: fakeRadioMultipleCodeElement({
    config: {
      layout: ConfigLayout.COLUMNS,
    },
    id: '1',
  })['1'],
}
