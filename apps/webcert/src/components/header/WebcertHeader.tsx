import { Banner, ResourceLinkType, SystemBanner, TextWithInfoModal } from '@frontend/common'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import AboutWebcertModalContent from '../../feature/certificate/Modals/AboutWebcertModalContent'
import { resetListState } from '../../store/list/listActions'
import { resetPatientState } from '../../store/patient/patientActions'
import {
  getLoggedInCareProvider,
  getUser,
  getUserResourceLink,
  getUserResourceLinks,
  getUserStatistics,
  isDoctor,
} from '../../store/user/userSelectors'
import Logout from '../../utils/Logout'
import { getUserTabs } from '../../utils/userTabsUtils'
import AppHeader from '../AppHeader/AppHeader'
import SystemBanners from '../notification/SystemBanners'
import WebcertHeaderUnit from './WebcertHeaderUnit'
import WebcertHeaderUser from './WebcertHeaderUser'
import logo from './webcert_logo.png'

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
  const loggedInCareProvider = useSelector(getLoggedInCareProvider)
  const careProviders = user && user?.careProviders
  const unitName = user && user.loggedInUnit.unitName
  const resourceLink = useSelector(getUserResourceLink(ResourceLinkType.WARNING_NORMAL_ORIGIN))

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
  }

  const missingSubscription = () => {
    if (loggedInCareProvider?.unitId == null) {
      return false
    } else {
      return careProviders?.filter((careProvider) => loggedInCareProvider?.unitId === careProvider.id)[0].missingSubscription
    }
  }
  const displayWarningNormalOriginBanner = () => {
    return resourceLink
  }

  const subscriptionWarning: Banner = {
    message:
      'Abonnemang för Webcert saknas. Du har endast tillgång till Webcert för att läsa, skriva ut och makulera eventuella tidigare utfärdade intyg.',
    priority: 'MEDEL',
  }
  const warningNormalOrigin: Banner = {
    message:
      'Du har loggat in i fristående Webcert istället för direkt via ditt journalsystem. ' +
      unitName +
      ' har integrerat sitt journalsystem med Webcert. Om du skapar intyg i fristående Webcert kommer intygen inte synkroniseras med journalsystemet.',
    priority: 'MEDEL',
  }
  const getBannersToDisplay = (): React.ReactNode[] => {
    return [
      missingSubscription() && <SystemBanner key="system-banner-1" banner={subscriptionWarning} />,
      displayWarningNormalOriginBanner() && <SystemBanner key="system-banner-2" banner={warningNormalOrigin} />,
    ].filter(Boolean)
  }

  return (
    <AppHeader
      logo={logo}
      alt={'Logo Webcert'}
      primaryItems={isEmpty ? [] : [<WebcertHeaderUser key="user" />, <WebcertHeaderUnit key="header" />]}
      secondaryItems={getSecondaryItems()}
      banners={[<SystemBanners key="system-banners" />]}
      tabs={tabs}
      onSwitchTab={onSwitchTab}
      subMenuBanners={getBannersToDisplay()}
    />
  )
}

export default WebcertHeader
