import React from 'react'

import { Story } from '@storybook/react'
import AppHeader, { AppHeaderProps } from './AppHeader'

export default {
  title: 'Components/AppHeader',
  component: AppHeader,
}

const Template: Story<AppHeaderProps> = (args: AppHeaderProps) => <AppHeader title={args.title} />

export const Webcert = Template.bind({})
Webcert.args = {
  title: 'Webcert',
}

Webcert.storyName = 'Webcert app header'

export const Rehabstod = Template.bind({})
Rehabstod.args = {
  title: 'Rehabstöd',
}

Rehabstod.storyName = 'Rehabstöd app header'
