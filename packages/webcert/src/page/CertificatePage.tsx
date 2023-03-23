import { ResourceLinkType } from '@frontend/common'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import CommonLayout from '../components/commonLayout/CommonLayout'
import WebcertHeader from '../components/header/WebcertHeader'
import Certificate from '../feature/certificate/Certificate'
import CertificateHeader from '../feature/certificate/CertificateHeader/CertificateHeader'
import CertificateSidePanel from '../feature/certificate/CertificateSidePanel/CertificateSidePanel'
import { DeathCertificateConfirmModalIntegrated } from '../feature/certificate/Modals/DeathCertificateConfirmModalIntegrated'
import MajorVersionNotification from '../feature/certificate/NotificationBanners/MajorVersionNotification'
import ReadOnlyViewNotification from '../feature/certificate/NotificationBanners/ReadOnlyViewNotification'
import CertificateDeletedHandler from '../feature/certificate/RemovedCertificate/CertificateDeletedHandler'
import CertificateDeletedModal from '../feature/certificate/RemovedCertificate/CertificateDeletedModal'
import { getCertificate } from '../store/certificate/certificateActions'
import {
  getCertificateMetaData,
  getIsCertificateDeleted,
  getIsRoutedFromDeletedCertificate,
  getResourceLinks,
} from '../store/certificate/certificateSelectors'
import { getUserStatistics } from '../store/user/userActions'
import { throwError } from '../store/error/errorActions'
import { ErrorCode, ErrorType } from '../store/error/errorReducer'

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
  error: string
}

const CertificatePage: React.FC = () => {
  const { certificateId, error } = useParams<Params>()
  const dispatch = useDispatch()
  const history = useHistory()
  const isCertificateDeleted = useSelector(getIsCertificateDeleted())
  const routedFromDeletedCertificate = useSelector(getIsRoutedFromDeletedCertificate())
  const links = useSelector(getResourceLinks)
  const isDBIntegrated = links.find((link) => link.type === ResourceLinkType.WARNING_DODSBEVIS_INTEGRATED)
  const [showDeathCertificateModal, setShowDeathCertificateModal] = useState(true)
  const metadata = useSelector(getCertificateMetaData)
  const patient = metadata?.patient

  useEffect(() => {
    if (certificateId) {
      dispatch(getCertificate(certificateId))
      dispatch(getUserStatistics())
    }
  }, [dispatch, certificateId])

  useEffect(() => {
    if (error) {
      dispatch(
        throwError({
          type: ErrorType.MODAL,
          errorCode: ErrorCode.SIGN_CERTIFICATE_ERROR,
          certificateId: certificateId,
        })
      )
    }
  }, [dispatch, error, certificateId])

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
        <>
          {isDBIntegrated && patient && (
            <DeathCertificateConfirmModalIntegrated
              certificateId={certificateId}
              patient={patient}
              setOpen={setShowDeathCertificateModal}
              open={showDeathCertificateModal}
            />
          )}
          <Columns className="iu-grid-cols iu-grid-cols-12 iu-grid-no-gap">
            <OverflowScroll className="iu-grid-span-7">
              <Certificate />
            </OverflowScroll>
            <OverflowHidden className="iu-grid-span-5">
              <CertificateSidePanel />
            </OverflowHidden>
          </Columns>
        </>
      )}
    </CommonLayout>
  )
}

export default CertificatePage
