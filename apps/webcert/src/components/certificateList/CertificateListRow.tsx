import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { DeathCertificateConfirmModal } from '../../feature/certificate/Modals/DeathCertificateConfirmModal'
import { LuaenaConfirmModal } from '../../feature/certificate/Modals/LuaenaConfirmModal'
import { MissingRelatedCertificateModal } from '../../feature/certificate/Modals/MissingRelatedCertificateModal'
import { createNewCertificate } from '../../store/certificate/certificateActions'
import { loadingCertificateTypes } from '../../store/patient/patientSelectors'
import TextWithDynamicLinks from '../../utils/TextWithDynamicLinks'
import { CreateCertificateButton } from './CreateCertificateButton'
import { StarFilledIcon, StarIcon } from '../../images'
import { Patient, ResourceLink, ResourceLinkType } from '../../types'
import InfoBox from '../utils/InfoBox'
import TextWithInfoModal from '../utils/Modal/TextWithInfoModal'

interface Props {
  certificateName: string
  certificateInfo: string
  id: string
  issuerTypeId: string
  preferenceClick: (...args: string[]) => void
  favorite: boolean
  message?: string
  patient?: Patient
  links: ResourceLink[]
}

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

const CertificateListRow: React.FC<Props> = ({
  certificateName,
  certificateInfo,
  id,
  issuerTypeId,
  preferenceClick,
  favorite,
  message,
  patient,
  links,
}) => {
  const dispatch = useDispatch()

  const isLoadingCertificateTypes = useSelector(loadingCertificateTypes)
  const [showMissingRelatedCertificateModal, setShowMissingRelatedCertificateModal] = useState(false)
  const [showDeathCertificateModal, setShowDeathCertificateModal] = useState(false)
  const [showLuaenaModal, setShowLuaenaModal] = useState(false)

  const createCertificateLink = links.find((link) => link.type === ResourceLinkType.CREATE_CERTIFICATE)
  const missingRelatedCertificateLink = links.find((link) => link.type === ResourceLinkType.MISSING_RELATED_CERTIFICATE_CONFIRMATION)

  const favoriteText = favorite ? 'Ta bort som favoritmarkerat intyg.' : 'Markera intyget som favorit och fäst högst upp i listan.'
  const onPreferenceClick = () => {
    preferenceClick(id)
  }

  const handleCreateCertificate = (certificateType: string, patientId: string, links: ResourceLink[]) => {
    const createDodsbevis = links.some((link) => link.type === ResourceLinkType.CREATE_DODSBEVIS_CONFIRMATION)
    const createLuaena = links.some((link) => link.type === ResourceLinkType.CREATE_LUAENA_CONFIRMATION)
    const hasMissingRelatedCertificate = links.some((link) => link.type === ResourceLinkType.MISSING_RELATED_CERTIFICATE_CONFIRMATION)

    if (createDodsbevis) {
      setShowDeathCertificateModal(true)
    } else if (createLuaena) {
      setShowLuaenaModal(true)
    } else if (hasMissingRelatedCertificate) {
      setShowMissingRelatedCertificateModal(true)
    } else {
      dispatch(createNewCertificate({ certificateType, patientId }))
    }
  }

  return (
    <>
      {patient && (
        <>
          <DeathCertificateConfirmModal patient={patient} setOpen={setShowDeathCertificateModal} open={showDeathCertificateModal} />
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
      <Row className="iu-flex iu-flex-column iu-p-400">
        <div className="iu-flex iu-flex-center">
          <Star className="iu-mr-1rem" onClick={onPreferenceClick} data-tip={favoriteText} aria-label={favoriteText}>
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

export default CertificateListRow
