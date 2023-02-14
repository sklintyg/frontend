import { Story } from '@storybook/react'
import React, { ComponentProps } from 'react'
import Dropdown from './Dropdown'

export default {
  title: 'Components/Dropdown',
  component: Dropdown,
}

const Template: Story<ComponentProps<typeof Dropdown>> = ({ ...args }) => {
  return (
    <Dropdown {...args}>
      <option id="1">First</option>
      <option id="2">Second</option>
      <option id="3">Third</option>
    </Dropdown>
  )
}

export const Default = Template.bind({})
Default.args = {}

export const Error = Template.bind({})
Error.args = {
  error: true,
}
