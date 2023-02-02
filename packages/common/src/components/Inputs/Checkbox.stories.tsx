import { Story } from '@storybook/react'
import faker from 'faker'
import React, { ComponentProps } from 'react'
import Checkbox from './Checkbox'

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
}

const Template: Story<ComponentProps<typeof Checkbox>> = ({ ...args }) => {
  return <Checkbox {...args} />
}

export const Default = Template.bind({})
Default.args = {
  label: faker.lorem.sentence(),
}

export const Error = Template.bind({})
Error.args = {
  hasValidationError: true,
  label: faker.lorem.sentence(),
}
