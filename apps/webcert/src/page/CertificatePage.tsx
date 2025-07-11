import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import CommonLayout from '../components/commonLayout/CommonLayout'
import WebcertHeader from '../components/header/WebcertHeader'
import Certificate from '../feature/certificate/Certificate'
import { CertificateHeader } from '../feature/certificate/CertificateHeader/CertificateHeader'
import CertificateSidePanel from '../feature/certificate/CertificateSidePanel/CertificateSidePanel'
import { ConfirmationModal } from '../feature/certificate/Modals/ConfirmationModal'
import { LuaenaConfirmModalIntegrated } from '../feature/certificate/Modals/LuaenaConfirmModalIntegrated'
import InactiveCertificateTypeNotification from '../feature/certificate/NotificationBanners/InactiveCertificateTypeNotification'
import MajorVersionNotification from '../feature/certificate/NotificationBanners/MajorVersionNotification'
import ReadOnlyViewNotification from '../feature/certificate/NotificationBanners/ReadOnlyViewNotification'
import RemovedCertificate from '../feature/certificate/RemovedCertificate/RemovedCertificate'
import { getCertificate } from '../store/certificate/certificateActions'
import {
  getCertificateMetaData,
  getCertificateResourceLink,
  getIsCertificateDeleted,
  getIsShowSpinner,
} from '../store/certificate/certificateSelectors'
import { throwError } from '../store/error/errorActions'
import { ErrorCode, ErrorType } from '../store/error/errorReducer'
import type { RootState } from '../store/store'
import { useAppSelector } from '../store/store'
import { getUserStatistics } from '../store/user/userActions'
import { ResourceLinkType } from '../types'

const OverflowScroll = styled.div`
  overflow-y: auto;
`

const OverflowHidden = styled.div`
  overflow-y: hidden;
`

const Columns = styled.div`
  height: 100%;
`

const CertificatePage = () => {
  const dispatch = useDispatch()
  const { certificateId, error } = useParams()
  const isCertificateDeleted = useAppSelector(getIsCertificateDeleted())
  const hasPatient = useAppSelector((state: RootState) => state.ui.uiCertificate.certificate?.metadata.patient !== null)
  const currentCertificateId = useAppSelector((state: RootState) => state.ui.uiCertificate.certificate?.metadata.id)
  const isLoadingCertificate = useAppSelector(getIsShowSpinner)
  const isLuaenaIntegrated = useAppSelector(getCertificateResourceLink(ResourceLinkType.WARNING_LUAENA_INTEGRATED))
  const confirmationModal = useAppSelector((state) => getCertificateMetaData(state)?.confirmationModal)
  const [showLuaenaModal, setShowLuaenaModal] = useState(true)
  const [showConfirmationModal, setShowConfirmationModal] = useState(true)

  useEffect(() => {
    if (certificateId && !isLoadingCertificate && certificateId !== currentCertificateId) {
      dispatch(getCertificate(certificateId))
      dispatch(getUserStatistics())
    }
  }, [dispatch, certificateId, isLoadingCertificate, isCertificateDeleted, currentCertificateId])

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
            <InactiveCertificateTypeNotification />
            <ReadOnlyViewNotification />
            <CertificateHeader />
          </>
        )
      }
      noPadding={true}
      hasSidePanel={true}
    >
      {isCertificateDeleted ? (
        <RemovedCertificate />
      ) : (
        <>
          {confirmationModal && hasPatient && (
            <ConfirmationModal
              open={showConfirmationModal}
              setOpen={setShowConfirmationModal}
              certificateId={certificateId}
              {...confirmationModal}
            />
          )}
          {certificateId && isLuaenaIntegrated && hasPatient && (
            <LuaenaConfirmModalIntegrated certificateId={certificateId} setOpen={setShowLuaenaModal} open={showLuaenaModal} />
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
