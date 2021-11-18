import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Certificate from '../feature/certificate/Certificate'
import CertificateHeader from '../feature/certificate/CertificateHeader/CertificateHeader'
import { getCertificate } from '../store/certificate/certificateActions'
import CertificateSidePanel from '../feature/certificate/CertificateSidePanel/CertificateSidePanel'
import { AppHeader, AppHeaderLink } from '@frontend/common'
import WebcertHeaderUser from '../components/header/WebcertHeaderUser'
import RemovedCertificate from '../feature/certificate/RemovedCertificate/RemovedCertificate'
import { getIsCertificateDeleted } from '../store/certificate/certificateSelectors'
import styled from 'styled-components/macro'
import logo from '../components/header/webcert_logo.png'
import WebcertHeaderUnit from '../components/header/WebcertHeaderUnit'
import MajorVersionNotification from '../feature/certificate/Notifications/MajorVersionNotification'
import { TextWithInfoModal } from '@frontend/common/src'
import AboutWebcertModalContent from '../feature/certificate/Modals/AboutWebcertModalContent'

const Root = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`

const OverflowScroll = styled.div`
  overflow-y: auto;
`

const OverflowHidden = styled.div`
  overflow-y: hidden;
`

const NoFlexGrow = styled.div`
  flex-grow: 0;
`

const Content = styled.div`
  overflow: hidden;
  flex-grow: 1;
`

const Columns = styled.div`
  height: 100%;
`

interface Params {
  certificateId: string
}

const CertificatePage: React.FC = () => {
  const { certificateId } = useParams<Params>()
  const dispatch = useDispatch()
  const certificateIsDeleted = useSelector(getIsCertificateDeleted())

  useEffect(() => {
    if (certificateId) {
      dispatch(getCertificate(certificateId))
    }
  }, [dispatch, certificateId])

  const secondaryItems = [
    <TextWithInfoModal text={'Om Webcert'} modalTitle={'Om Webcert'}>
      <AboutWebcertModalContent />
    </TextWithInfoModal>,
  ]

  // Todo: Remove fixed height below and do some JS magic to calculate the height.
  return (
    <Root>
      <NoFlexGrow>
        <AppHeader
          logo={logo}
          alt={'Logo Webcert'}
          primaryItems={[<WebcertHeaderUser />, <WebcertHeaderUnit />]}
          secondaryItems={secondaryItems}
        />
      </NoFlexGrow>
      {certificateIsDeleted ? (
        <RemovedCertificate />
      ) : (
        <>
          <NoFlexGrow>
            <MajorVersionNotification />
            <CertificateHeader />
          </NoFlexGrow>
          <Content className={`ic-container`}>
            <Columns className="iu-grid-cols iu-grid-cols-12 iu-grid-no-gap">
              <OverflowScroll className="iu-grid-span-7">
                <Certificate />
              </OverflowScroll>
              <OverflowHidden className="iu-grid-span-5">
                <CertificateSidePanel />
              </OverflowHidden>
            </Columns>
          </Content>
        </>
      )}
    </Root>
  )
}

export default CertificatePage
