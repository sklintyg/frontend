import React from 'react'

import { Story } from '@storybook/react'
import { fakeBooleanElement, fakeTextElement } from '../../utils/faker/fakeCertificateData'
import UvText, { Props } from './UvText'

export default {
  title: 'Components/UvText',
  component: UvText,
}

const Template: Story<Props> = (args) => <UvText {...args} />

export const BooleanValue = Template.bind({})
BooleanValue.args = {
  question: fakeBooleanElement({ id: '1' })['1'],
}

export const TextValue = Template.bind({})
TextValue.args = {
  question: fakeTextElement({ id: '1' })['1'],
}
