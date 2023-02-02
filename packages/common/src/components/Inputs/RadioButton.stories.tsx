import { Story } from '@storybook/react'
import faker from 'faker'
import React, { ComponentProps } from 'react'
import RadioButton from './RadioButton'

export default {
  title: 'Components/RadioButton',
  component: RadioButton,
}

const Template: Story<ComponentProps<typeof RadioButton>> = ({ ...args }) => {
  return <RadioButton {...args} />
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
