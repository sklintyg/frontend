import React from 'react'
import { AppHeader, ResourceLinkType, TextWithInfoModal } from '@frontend/common'
import logo from './webcert_logo.png'
import WebcertHeaderUser from './WebcertHeaderUser'
import WebcertHeaderUnit from './WebcertHeaderUnit'
import SystemBanners from '../notification/SystemBanners'
import AboutWebcertModalContent from '../../feature/certificate/Modals/AboutWebcertModalContent'
import { getSwitchTab, getUser, getUserResourceLinks, getUserStatistics, isDoctor } from '../../store/user/userSelectors'
import { useDispatch, useSelector } from 'react-redux'
import Logout from '../../utils/Logout'
import styled from 'styled-components'
import { getUserTabs } from '../../utils/userTabsUtils'
import { resetPatientState } from '../../store/patient/patientActions'
import { resetListState } from '../../store/list/listActions'
import { updateSwitchTab } from '../../store/user/userActions'

const InfoModal = styled(TextWithInfoModal)`
  text-decoration: none;
`

interface Props {
  isEmpty?: boolean
}

const WebcertHeader: React.FC<Props> = ({ isEmpty = false }) => {
  const userLinks = useSelector(getUserResourceLinks)
  const user = useSelector(getUser)
  const isUserDoctor = useSelector(isDoctor)
  const links = useSelector(getUserResourceLinks)
  const userStatistics = useSelector(getUserStatistics)
  const tabs = getUserTabs(!!isUserDoctor, userStatistics, links)
  const dispatch = useDispatch()
  const switchTab = useSelector(getSwitchTab)

  const getSecondaryItems = (): React.ReactNode[] => {
    const secondaryItems: React.ReactNode[] = []
    if (isEmpty) {
      return secondaryItems
    }

    secondaryItems.push(
      <InfoModal text={'Om Webcert'} modalTitle={'Om Webcert'}>
        <AboutWebcertModalContent />
      </InfoModal>
    )

    const logoutLink = userLinks?.find((link) => link.type === ResourceLinkType.LOG_OUT)
    if (logoutLink) {
      secondaryItems.push(<Logout user={user} link={logoutLink} />)
    }

    return secondaryItems
  }

  const onSwitchTab = () => {
    dispatch(resetPatientState())
    dispatch(resetListState())
    dispatch(updateSwitchTab(-1))
  }

  return (
    <AppHeader
      logo={logo}
      alt={'Logo Webcert'}
      primaryItems={isEmpty ? [] : [<WebcertHeaderUser />, <WebcertHeaderUnit />]}
      secondaryItems={getSecondaryItems()}
      banners={[<SystemBanners key={'system-banners'} />]}
      tabs={tabs}
      onSwitchTab={onSwitchTab}
      switchTab={switchTab}
    />
  )
}

export default WebcertHeader
