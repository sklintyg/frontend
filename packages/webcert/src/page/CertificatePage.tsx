import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Certificate from '../feature/certificate/Certificate'
import CertificateHeader from '../feature/certificate/CertificateHeader/CertificateHeader'
import { getCertificate } from '../store/certificate/certificateActions'
import CertificateSidePanel from '../feature/certificate/CertificateSidePanel/CertificateSidePanel'
import styled from 'styled-components/macro'
import MajorVersionNotification from '../feature/certificate/NotificationBanners/MajorVersionNotification'
import ReadOnlyViewNotification from '../feature/certificate/NotificationBanners/ReadOnlyViewNotification'
import WebcertHeader from '../components/header/WebcertHeader'
import CertificateDeletedHandler from '../feature/certificate/RemovedCertificate/CertificateDeletedHandler'
import { getIsCertificateDeleted, getIsRoutedFromDeletedCertificate } from '../store/certificate/certificateSelectors'
import CertificateDeletedModal from '../feature/certificate/RemovedCertificate/CertificateDeletedModal'
import { getUserStatistics } from '../store/user/userActions'
import CommonLayout from '../components/commonLayout/CommonLayout'

const OverflowScroll = styled.div`
  overflow-y: auto;
`

const OverflowHidden = styled.div`
  overflow-y: hidden;
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
  const isCertificateDeleted = useSelector(getIsCertificateDeleted())
  const routedFromDeletedCertificate = useSelector(getIsRoutedFromDeletedCertificate())

  useEffect(() => {
    if (certificateId) {
      dispatch(getCertificate(certificateId))
      dispatch(getUserStatistics())
    }
  }, [dispatch, certificateId])

  return (
    <CommonLayout
      header={<WebcertHeader />}
      subHeader={
        !isCertificateDeleted && (
          <>
            <MajorVersionNotification />
            <ReadOnlyViewNotification />
            <CertificateHeader />
            <CertificateDeletedModal routedFromDeletedCertificate={routedFromDeletedCertificate} />
          </>
        )
      }
      noPadding={true}
      hasSidePanel={true}>
      {isCertificateDeleted ? (
        <CertificateDeletedHandler />
      ) : (
        <Columns className="iu-grid-cols iu-grid-cols-12 iu-grid-no-gap">
          <OverflowScroll className="iu-grid-span-7">
            <Certificate />
          </OverflowScroll>
          <OverflowHidden className="iu-grid-span-5">
            <CertificateSidePanel />
          </OverflowHidden>
        </Columns>
      )}
    </CommonLayout>
  )
}

export default CertificatePage
