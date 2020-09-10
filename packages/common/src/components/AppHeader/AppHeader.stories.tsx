import React from 'react'
import { Story } from '@storybook/react'
import AppHeader, { AppHeaderProps } from './AppHeader'
import AppHeaderTitle from './AppHeaderTitle'
import webcertImg from '../../../../webcert/src/components/header/webcert_logo.png'
import minaIntygImg from './logo-minaintyg-white-retina.png'
import { Provider } from 'react-redux'
import store from '@frontend/webcert/src/store/store'
import WebcertHeaderUser from '@frontend/webcert/src/components/header/WebcertHeaderUser'
import AppHeaderAbout from './AppHeaderAbout'

export default {
  title: 'Components/AppHeader',
  component: AppHeader,
}

const Template: Story<AppHeaderProps> = (args: AppHeaderProps) => (
  <Provider store={store}>
    <AppHeader {...args} />
  </Provider>
)

export const WebcertDefault = Template.bind({})
WebcertDefault.args = {
  title: <AppHeaderTitle imgSrc={webcertImg} />,
}

WebcertDefault.storyName = 'Webcert app header default'

export const WebcertWithUser = Template.bind({})
WebcertWithUser.args = {
  title: <AppHeaderTitle imgSrc={webcertImg} />,
  primaryItems: <WebcertHeaderUser></WebcertHeaderUser>,
}

WebcertWithUser.storyName = 'Webcert app header with user'

export const WebcertWithUserAndAbout = Template.bind({})
WebcertWithUserAndAbout.args = {
  title: <AppHeaderTitle imgSrc={webcertImg} />,
  primaryItems: <WebcertHeaderUser></WebcertHeaderUser>,
  secondaryItems: <AppHeaderAbout text={'Om Webcert'} link={'#'}></AppHeaderAbout>,
}

WebcertWithUserAndAbout.storyName = 'Webcert app header with user and about'

export const MinaIntyg = Template.bind({})
MinaIntyg.args = {
  title: <AppHeaderTitle imgSrc={minaIntygImg} />,
}

MinaIntyg.storyName = 'Minaintyg app header'
