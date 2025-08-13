import { getByType } from '@frontend/utils'
import { useState } from 'react'
import styled from 'styled-components'
import { ConfirmationModal } from '../../feature/certificate/Modals/ConfirmationModal'
import { LuaenaConfirmModal } from '../../feature/certificate/Modals/LuaenaConfirmModal'
import { MissingRelatedCertificateModal } from '../../feature/certificate/Modals/MissingRelatedCertificateModal'
import { StarFilledIcon, StarIcon } from '../../images'
import { createNewCertificate } from '../../store/certificate/certificateActions'
import { loadingCertificateTypes } from '../../store/patient/patientSelectors'
import { useAppDispatch, useAppSelector } from '../../store/store'
import type { Patient, ResourceLink } from '../../types'
import { ResourceLinkType } from '../../types'
import type { CertificateConfirmationModal } from '../../types/confirmModal'
import TextWithDynamicLinks from '../../utils/TextWithDynamicLinks'
import InfoBox from '../utils/InfoBox'
import TextWithInfoModal from '../utils/Modal/TextWithInfoModal'
import { CreateCertificateButton } from './CreateCertificateButton'

const Row = styled.div`
  border-bottom: #e0e0e0 1px solid;
`

const Star = styled.button`
  border: none;
  background: transparent;
  color: inherit;
`

const CertificateName = styled.div`
  flex: 1;
`

const ModalContent = styled.div`
  white-space: pre-line;
`

export function CertificateListRow({
  certificateName,
  certificateInfo,
  id,
  issuerTypeId,
  preferenceClick,
  favorite,
  message,
  patient,
  links,
  confirmationModal,
}: {
  certificateName: string
  certificateInfo: string
  id: string
  issuerTypeId: string
  preferenceClick: (...args: string[]) => void
  favorite: boolean
  message?: string
  patient?: Patient
  links: ResourceLink[]
  confirmationModal: CertificateConfirmationModal | null
}) {
  const dispatch = useAppDispatch()

  const isLoadingCertificateTypes = useAppSelector(loadingCertificateTypes)
  const [showMissingRelatedCertificateModal, setShowMissingRelatedCertificateModal] = useState(false)
  const [showLuaenaModal, setShowLuaenaModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const createCertificateLink = getByType(links, ResourceLinkType.CREATE_CERTIFICATE)
  const missingRelatedCertificateLink = getByType(links, ResourceLinkType.MISSING_RELATED_CERTIFICATE_CONFIRMATION)

  const favoriteText = favorite ? 'Ta bort som favoritmarkerat intyg.' : 'Markera intyget som favorit och fäst högst upp i listan.'
  const onPreferenceClick = () => {
    preferenceClick(id)
  }

  const handleCreateCertificate = (certificateType: string, patientId: string, links: ResourceLink[]) => {
    const createLuaena = links.some((link) => link.type === ResourceLinkType.CREATE_LUAENA_CONFIRMATION)
    const hasMissingRelatedCertificate = links.some((link) => link.type === ResourceLinkType.MISSING_RELATED_CERTIFICATE_CONFIRMATION)

    if (confirmationModal) {
      return setShowConfirmModal(true)
    }
    if (createLuaena) {
      return setShowLuaenaModal(true)
    }
    if (hasMissingRelatedCertificate) {
      return setShowMissingRelatedCertificateModal(true)
    }
    return dispatch(createNewCertificate({ certificateType, patientId }))
  }

  return (
    <>
      {patient && (
        <>
          {confirmationModal && (
            <ConfirmationModal
              open={showConfirmModal}
              setOpen={setShowConfirmModal}
              certificateType={id}
              patientId={patient.personId.id}
              {...confirmationModal}
            />
          )}
          <LuaenaConfirmModal patient={patient} setOpen={setShowLuaenaModal} open={showLuaenaModal} />
          {missingRelatedCertificateLink?.type !== undefined && (
            <MissingRelatedCertificateModal
              createCertificateType={id}
              confirmButtonText={'Skapa intyg'}
              patient={patient}
              setOpen={setShowMissingRelatedCertificateModal}
              open={showMissingRelatedCertificateModal}
              {...missingRelatedCertificateLink}
            />
          )}
        </>
      )}
      <Row data-testid={`certificate-list-row-${id}`} className="iu-flex iu-flex-column iu-p-400">
        <div className="iu-flex iu-flex-center">
          <Star
            className="iu-mr-1rem"
            onClick={onPreferenceClick}
            data-tooltip-id="tooltip"
            data-tooltip-content={favoriteText}
            aria-label={favoriteText}
          >
            {favorite ? <StarFilledIcon className="iu-color-information" /> : <StarIcon className="iu-color-muted" />}
          </Star>
          <CertificateName>
            <span className="iu-fw-bold">{certificateName}</span> {issuerTypeId.toUpperCase()}
          </CertificateName>
          <TextWithInfoModal text="Om intyget" modalTitle={`Om ${certificateName}`} className="iu-mr-1rem">
            <ModalContent>
              <TextWithDynamicLinks text={certificateInfo} />
            </ModalContent>
          </TextWithInfoModal>
          {patient && createCertificateLink && (
            <CreateCertificateButton
              id={id}
              onClick={(certificateType: string) => {
                handleCreateCertificate(certificateType, patient.personId.id, links)
              }}
              disabled={isLoadingCertificateTypes}
              {...createCertificateLink}
            />
          )}
        </div>
        {message && (
          <div className="iu-pt-200">
            <InfoBox type="info">{message}</InfoBox>
          </div>
        )}
      </Row>
    </>
  )
}
