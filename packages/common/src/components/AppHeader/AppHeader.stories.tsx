import React from 'react'
import { Story } from '@storybook/react'
import AppHeader, { AppHeaderProps } from './AppHeader'
import AppHeaderTitle from './AppHeaderTitle'
import webcertImg from '../../../../webcert/src/components/header/webcert_logo.png'
import { AppHeaderUser } from '../index'
import { mockGetUserSelector } from '../..'

export default {
  title: 'Components/AppHeader',
  component: AppHeader,
}

const Template: Story<AppHeaderProps> = (args: AppHeaderProps) => (
  <AppHeader
    displayAbout={true}
    aboutText={'Om Webcert'}
    aboutHref={'#'}
    displayUser={true}
    title={<AppHeaderTitle imgSrc={webcertImg} />}
    appHeaderUser={<AppHeaderUser getUserSelector={mockGetUserSelector} />}
  />
)

export const Webcert = Template.bind({})
Webcert.args = {
  appHeaderTitle: <AppHeaderTitle imgSrc={webcertImg} />,
}

Webcert.storyName = 'Webcert app header'

export const MinaIntyg = Template.bind({})
MinaIntyg.args = {
  appHeaderTitle: <AppHeaderTitle imgSrc={webcertImg} />,
  displayUser: false,
}

MinaIntyg.storyName = 'Minaintyg app header'
