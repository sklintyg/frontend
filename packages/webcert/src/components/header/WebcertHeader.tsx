import React from 'react'
import { AppHeader, resourceLinksAreEqual, ResourceLinkType, TextWithInfoModal } from '@frontend/common'
import logo from './webcert_logo.png'
import WebcertHeaderUser from './WebcertHeaderUser'
import WebcertHeaderUnit from './WebcertHeaderUnit'
import SystemBanners from '../notification/SystemBanners'
import AboutWebcertModalContent from '../../feature/certificate/Modals/AboutWebcertModalContent'
import { getUserResourceLinks } from '../../store/user/userSelectors'
import { useDispatch, useSelector } from 'react-redux'
import Logout from '../utils/Logout'
import { getDrafts } from '../../store/list/listActions'
import { ListDraftFilter } from '@frontend/common/src/types/list'

interface Props {
  isEmpty?: boolean
}

const WebcertHeader: React.FC<Props> = ({ isEmpty = false }) => {
  const userLinks = useSelector(getUserResourceLinks)
  const dispatch = useDispatch()

  const getSecondaryItems = (): React.ReactNode[] => {
    const secondaryItems: React.ReactNode[] = []
    if (isEmpty) {
      return secondaryItems
    }

    const filter: ListDraftFilter = {
      ascending: false,
      forwarded: false,
      orderBy: 'FORWARDED',
      pageSize: 100,
      patientId: '',
      savedByHsaID: '',
      savedFrom: undefined,
      savedTo: undefined,
      startFrom: 0,
      status: undefined,
    }

    secondaryItems.push(
      <>
        <button onClick={() => dispatch(getDrafts(filter))}>Get drafts</button>
        <TextWithInfoModal text={'Om Webcert'} modalTitle={'Om Webcert'}>
          <AboutWebcertModalContent />
        </TextWithInfoModal>
      </>
    )

    const logoutLink = userLinks && userLinks.find((link) => resourceLinksAreEqual(link.type, ResourceLinkType.LOG_OUT))
    if (logoutLink) {
      secondaryItems.push(<Logout link={logoutLink} className={secondaryItems.length > 0 ? 'iu-link-divider-left iu-pr-300' : ''} />)
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
