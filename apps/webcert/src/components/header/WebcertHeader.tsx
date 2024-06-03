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
  isCareAdministrator,
} from '../../store/user/userSelectors'
import { Banner, ResourceLinkType } from '../../types'
import Logout from '../../utils/Logout'
import { getUserTabs } from '../../utils/userTabsUtils'
import AppHeader from '../AppHeader/AppHeader'
import { UserHeaderMenu, UserHeaderMenuItem } from '../AppHeader/UserHeaderMenu'
import SystemBanners from '../notification/SystemBanners'
import TextWithInfoModal from '../utils/Modal/TextWithInfoModal'
import SystemBanner from '../utils/SystemBanner'
import { WithResourceLink } from '../utils/WithResourceLink'
import WebcertHeaderUnit from './WebcertHeaderUnit'
import WebcertHeaderUser from './WebcertHeaderUser'
import logo from './webcert_logo.png'

const InfoModal = styled(TextWithInfoModal)`
  text-decoration: none;
`

function WebcertHeader({ isEmpty = false }) {
  const userLinks = useSelector(getUserResourceLinks)
  const user = useSelector(getUser)
  const isCareAdmin = useSelector(isCareAdministrator)
  const links = useSelector(getUserResourceLinks)
  const userStatistics = useSelector(getUserStatistics)
  const tabs = getUserTabs(!!isCareAdmin, userStatistics, links)
  const dispatch = useDispatch()
  const loggedInCareProvider = useSelector(getLoggedInCareProvider)
  const careProviders = user && user?.careProviders
  const unitName = user && user.loggedInUnit.unitName
  const displayWarningNormalOriginBanner = useSelector(getUserResourceLink(ResourceLinkType.WARNING_NORMAL_ORIGIN))

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
  const banners: React.ReactNode[] = [
    missingSubscription() && <SystemBanner key="system-banner-1" banner={subscriptionWarning} />,
    displayWarningNormalOriginBanner && <SystemBanner key="system-banner-2" banner={warningNormalOrigin} />,
  ].filter(Boolean)

  return (
    <AppHeader
      logo={logo}
      alt={'Logo Webcert'}
      primaryUserMenu={
        isEmpty ? (
          []
        ) : (
          <>
            <WebcertHeaderUser />
            <WebcertHeaderUnit />
          </>
        )
      }
      secondaryUserMenu={
        <UserHeaderMenu>
          {!isEmpty && (
            <>
              <UserHeaderMenuItem>
                <InfoModal text="Om Webcert" modalTitle="Om Webcert">
                  <AboutWebcertModalContent />
                </InfoModal>
              </UserHeaderMenuItem>
              <WithResourceLink type={ResourceLinkType.LOG_OUT} links={userLinks}>
                {(link) => (
                  <UserHeaderMenuItem>
                    <Logout user={user} link={link} />
                  </UserHeaderMenuItem>
                )}
              </WithResourceLink>
            </>
          )}
        </UserHeaderMenu>
      }
      banners={[<SystemBanners key="system-banners" />]}
      tabs={tabs}
      onSwitchTab={onSwitchTab}
      subMenuBanners={banners}
    />
  )
}

export default WebcertHeader
