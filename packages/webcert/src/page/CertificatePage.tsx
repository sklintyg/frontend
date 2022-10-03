import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components/macro'
import CommonLayout from '../components/commonLayout/CommonLayout'
import WebcertHeader from '../components/header/WebcertHeader'
import Certificate from '../feature/certificate/Certificate'
import CertificateHeader from '../feature/certificate/CertificateHeader/CertificateHeader'
import CertificateSidePanel from '../feature/certificate/CertificateSidePanel/CertificateSidePanel'
import MajorVersionNotification from '../feature/certificate/NotificationBanners/MajorVersionNotification'
import ReadOnlyViewNotification from '../feature/certificate/NotificationBanners/ReadOnlyViewNotification'
import CertificateDeletedHandler from '../feature/certificate/RemovedCertificate/CertificateDeletedHandler'
import CertificateDeletedModal from '../feature/certificate/RemovedCertificate/CertificateDeletedModal'
import { getCertificate } from '../store/certificate/certificateActions'
import { getIsCertificateDeleted, getIsRoutedFromDeletedCertificate } from '../store/certificate/certificateSelectors'
import { getUserStatistics } from '../store/user/userActions'

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
            <CertificateHeader certificateId={certificateId} />
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
