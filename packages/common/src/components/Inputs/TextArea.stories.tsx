import { Story } from '@storybook/react'
import React, { ComponentProps } from 'react'
import TextArea from './TextArea'

export default {
  title: 'Components/TextArea',
  component: TextArea,
}

const Template: Story<ComponentProps<typeof TextArea>> = ({ ...args }) => {
  return <TextArea {...args} />
}

export const Default = Template.bind({})
Default.args = {}

export const Error = Template.bind({})
Error.args = {
  hasValidationError: true,
}
