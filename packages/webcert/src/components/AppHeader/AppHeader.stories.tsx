import WebcertHeaderUser from '@frontend/webcert/src/components/header/WebcertHeaderUser'
import store from '@frontend/webcert/src/store/store'
import { Story } from '@storybook/react'
import { Provider } from 'react-redux'
import { BrowserRouter, Route } from 'react-router-dom'
import webcertImg from '../header/webcert_logo.png'
import AppHeader, { Props } from './AppHeader'
import AppHeaderLink from './AppHeaderLink'
import AppHeaderTitle from './AppHeaderTitle'

export default {
  title: 'Webcert/AppHeader',
  component: AppHeader,
}

const Template: Story<Props> = (args: Props) => (
  <Provider store={store}>
    <BrowserRouter>
      <Route>
        <AppHeader {...args} />
      </Route>
    </BrowserRouter>
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
  primaryItems: [<WebcertHeaderUser></WebcertHeaderUser>],
}

WebcertWithUser.storyName = 'Webcert app header with user'

export const WebcertWithUserAndAbout = Template.bind({})
WebcertWithUserAndAbout.args = {
  title: <AppHeaderTitle imgSrc={webcertImg} />,
  primaryItems: [<WebcertHeaderUser></WebcertHeaderUser>],
  secondaryItems: [
    <AppHeaderLink text={'Om Webcert'} link={'#'}></AppHeaderLink>,
    <AppHeaderLink text={'Logga ut'} link={'#'} withoutDivider={true}></AppHeaderLink>,
  ],
}

WebcertWithUserAndAbout.storyName = 'Webcert app header with user and about'
