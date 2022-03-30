import React from 'react'
import { AppHeader, ResourceLinkType, TextWithInfoModal } from '@frontend/common'
import logo from './webcert_logo.png'
import WebcertHeaderUser from './WebcertHeaderUser'
import WebcertHeaderUnit from './WebcertHeaderUnit'
import SystemBanners from '../notification/SystemBanners'
import AboutWebcertModalContent from '../../feature/certificate/Modals/AboutWebcertModalContent'
import { getUser, getUserResourceLinks } from '../../store/user/userSelectors'
import { useSelector } from 'react-redux'
import Logout from '../utils/Logout'

interface Props {
  isEmpty?: boolean
}

const WebcertHeader: React.FC<Props> = ({ isEmpty = false }) => {
  const userLinks = useSelector(getUserResourceLinks)
  const user = useSelector(getUser)

  const getSecondaryItems = (): React.ReactNode[] => {
    const secondaryItems: React.ReactNode[] = []
    if (isEmpty) {
      return secondaryItems
    }

    secondaryItems.push(
      <TextWithInfoModal text={'Om Webcert'} modalTitle={'Om Webcert'}>
        <AboutWebcertModalContent />
      </TextWithInfoModal>
    )

    const logoutLink = userLinks.find((link) => link.type === ResourceLinkType.LOG_OUT)
    if (logoutLink) {
      secondaryItems.push(
        <Logout user={user} link={logoutLink} className={secondaryItems.length > 0 ? 'iu-link-divider-left iu-pr-300' : ''} />
      )
    }

    return secondaryItems
  }

  return (
    <AppHeader
      logo={logo}
      alt={'Logo Webcert'}
      primaryItems={isEmpty ? [] : [<WebcertHeaderUser />, <WebcertHeaderUnit />]}
      secondaryItems={getSecondaryItems()}
      banners={[<SystemBanners key={'system-banners'} />]}
    />
  )
}

export default WebcertHeader
