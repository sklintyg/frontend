import React from 'react'

import { Story } from '@storybook/react'
import { fakeRadioBooleanElement, fakeTextAreaElement } from '../../utils/faker/fakeCertificateData'
import UvText, { Props } from './UvText'

export default {
  title: 'Components/UvText',
  component: UvText,
}

const Template: Story<Props> = (args) => <UvText {...args} />

export const BooleanValue = Template.bind({})
BooleanValue.args = {
  question: fakeRadioBooleanElement({ id: '1' })['1'],
}

export const TextValue = Template.bind({})
TextValue.args = {
  question: fakeTextAreaElement({ id: '1' })['1'],
}
