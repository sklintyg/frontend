import React from 'react'

import { Story } from '@storybook/react'
import { CertificateDataElement, UvText } from '../..'
import { createQuestionWithBooleanValue, createQuestionWithTextValue } from './UvText.test'

export default {
  title: 'Components/UvText',
  component: UvText,
}

const Template: Story<CertificateDataElement> = (args: CertificateDataElement) => <UvText question={args} />

export const BooleanValue = Template.bind({})
BooleanValue.args = createQuestionWithBooleanValue()

export const TextValue = Template.bind({})
TextValue.args = createQuestionWithTextValue()
