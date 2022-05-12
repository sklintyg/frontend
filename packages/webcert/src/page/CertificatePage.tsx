import React, { ReactNode, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Certificate from '../feature/certificate/Certificate'
import CertificateHeader from '../feature/certificate/CertificateHeader/CertificateHeader'
import { getCertificate } from '../store/certificate/certificateActions'
import CertificateSidePanel from '../feature/certificate/CertificateSidePanel/CertificateSidePanel'
import RemovedCertificate from '../feature/certificate/RemovedCertificate/RemovedCertificate'
import {
  getCertificatePageModal,
  getIsCertificateDeleted,
  getIsRoutedFromDeletedCertificate,
} from '../store/certificate/certificateSelectors'
import styled from 'styled-components/macro'
import MajorVersionNotification from '../feature/certificate/NotificationBanners/MajorVersionNotification'
import ReadOnlyViewNotification from '../feature/certificate/NotificationBanners/ReadOnlyViewNotification'
import CertificateDeletedModal from '../feature/certificate/Modals/CertificateDeletedModal'
import WebcertHeader from '../components/header/WebcertHeader'

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
  const routedFromDeletedCertificate = useSelector(getIsRoutedFromDeletedCertificate())
  const certificatePageModal = useSelector(getCertificatePageModal())
  const [modal, setModal] = useState<ReactNode>(null)

  const onSaveModal = (modal: ReactNode) => {
    setModal(modal)
  }

  useEffect(() => {
    if (certificateId) {
      dispatch(getCertificate(certificateId))
    }
  }, [dispatch, certificateId])

  return (
    <Root>
      {modal && modal}
      <CertificateDeletedModal routedFromDeletedCertificate={routedFromDeletedCertificate} />
      {certificatePageModal && <>{certificatePageModal}</>}
      <NoFlexGrow>
        <WebcertHeader />
      </NoFlexGrow>
      {certificateIsDeleted ? (
        <RemovedCertificate />
      ) : (
        <>
          <NoFlexGrow>
            <MajorVersionNotification />
            <ReadOnlyViewNotification />
            <CertificateHeader />
          </NoFlexGrow>
          <Content className={`ic-container`}>
            <Columns className="iu-grid-cols iu-grid-cols-12 iu-grid-no-gap">
              <OverflowScroll className="iu-grid-span-7">
                <Certificate onSaveModal={onSaveModal} />
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
