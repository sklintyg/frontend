import { Story } from '@storybook/react'
import React, { ComponentProps } from 'react'
import InfoBox from './InfoBox'

export default {
  title: 'Components/InfoBox',
  component: InfoBox,
}

const Template: Story<ComponentProps<typeof InfoBox>> = (args) => (
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
