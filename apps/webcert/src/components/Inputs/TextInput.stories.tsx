import { Story } from '@storybook/react'
import React, { ComponentProps } from 'react'
import TextInput from './TextInput'

export default {
  title: 'Components/TextInput',
  component: TextInput,
}

const Template: Story<ComponentProps<typeof TextInput>> = ({ ...args }) => {
  return <TextInput {...args} />
}

export const Default = Template.bind({})
Default.args = {}

export const Error = Template.bind({})
Error.args = {
  hasValidationError: true,
}
