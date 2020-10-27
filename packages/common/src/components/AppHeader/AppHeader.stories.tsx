import React from 'react'
import { Story } from '@storybook/react'
import AppHeader, { AppHeaderProps } from './AppHeaderLink'
import AppHeaderTitle from './AppHeaderTitle'
import webcertImg from '../../../../webcert/src/components/header/webcert_logo.png'
import { Provider } from 'react-redux'
import store from '@frontend/webcert/src/store/store'
import WebcertHeaderUser from '@frontend/webcert/src/components/header/WebcertHeaderUser'
import AppHeaderLink from './AppHeaderLink'

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
  secondaryItems: <AppHeaderLink text={'Om Webcert'} link={'#'}></AppHeaderLink>,
}

WebcertWithUserAndAbout.storyName = 'Webcert app header with user and about'
