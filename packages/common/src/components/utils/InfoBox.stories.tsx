import { Story } from '@storybook/react'
import React from 'react'
import InfoBox, { Props } from './InfoBox'

export default {
  title: 'Components/InfoBox',
  component: InfoBox,
}

const Template: Story<Props> = (args: Props) => (
  <InfoBox {...args}>
    <p>
      <strong>Some title</strong>
    </p>
    <p>Description text</p>
  </InfoBox>
)

export const Default = Template.bind({})
Default.args = {
  type: 'info',
}
