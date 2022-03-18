import React from 'react'
import { AppHeader, TextWithInfoModal } from '@frontend/common'
import logo from './webcert_logo.png'
import WebcertHeaderUser from './WebcertHeaderUser'
import WebcertHeaderUnit from './WebcertHeaderUnit'
import SystemBanners from '../notification/SystemBanners'
import AboutWebcertModalContent from '../../feature/certificate/Modals/AboutWebcertModalContent'

interface Props {
  isEmpty?: boolean
}

const WebcertHeader: React.FC<Props> = ({ isEmpty = false }) => {
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
