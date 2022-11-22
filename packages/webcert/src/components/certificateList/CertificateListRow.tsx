import { InfoBox, Patient, ResourceLink, ResourceLinkType, sanitizeText, TextWithInfoModal } from '@frontend/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as star } from '@fortawesome/free-regular-svg-icons'
import { faStar as starChecked } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import React, { useState } from 'react'
import styled from 'styled-components'
import WCDynamicLink from '../../utils/WCDynamicLink'
import { MissingRelatedCertificateModal } from '../../feature/certificate/Modals/MissingRelatedCertificateModal'
import { CreateCertificateButton } from './CreateCertificateButton'
import { useDispatch, useSelector } from 'react-redux'
import { createNewCertificate } from '../../store/certificate/certificateActions'
import { loadingCertificateTypes } from '../../store/patient/patientSelectors'
import { DeathCertificateConfirmModal } from '../../feature/certificate/Modals/DeathCertificateConfirmModal'

interface Props {
  certificateName: string
  certificateInfo: string
  id: string
  issuerTypeId: string
  preferenceClick: (...args: string[]) => void
  favorite: boolean
  message?: string
  patient?: Patient
  links?: ResourceLink[]
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

const hasDynamicLink = (text?: string): boolean => {
  if (!text) {
    return false
  }
  return text.split('<LINK:').length > 1
}

const formatText = (text?: string) => {
  if (!text) {
    return ''
  }
  const splitText = text.split('<LINK:')
  if (splitText.length > 1) {
    const dynamicLinkKey = splitText[1].split('>')[0]
    const textAfterLink = splitText[1].split('>')[1]
    return (
      <>
        <p>
          {splitText[0]}
          <WCDynamicLink linkKey={dynamicLinkKey} />
          {textAfterLink}
        </p>
      </>
    )
  }
  return text
}

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

  const createCertificateLink = links && links.find((link) => link.type === ResourceLinkType.CREATE_CERTIFICATE)
  const missingRelatedCertificateLink =
    links && links.find((link) => link.type === ResourceLinkType.MISSING_RELATED_CERTIFICATE_CONFIRMATION)

  const favoriteText = favorite ? 'Ta bort som favoritmarkerat intyg.' : 'Markera intyget som favorit och fäst högst upp i listan.'
  const onPreferenceClick = () => {
    preferenceClick(id)
  }

  const handleCreateCertificate = (certificateType: string, links?: ResourceLink[]) => {
    const createDodsbevis = links && links.some((link) => link.type === ResourceLinkType.CREATE_DODSBEVIS_CONFIRMATION)
    const hasMissingRelatedCertificate =
      links && links.some((link) => link.type === ResourceLinkType.MISSING_RELATED_CERTIFICATE_CONFIRMATION)

    if (createDodsbevis) {
      setShowDeathCertificateModal(true)
    } else if (hasMissingRelatedCertificate) {
      setShowMissingRelatedCertificateModal(true)
    } else {
      if (patient) {
        dispatch(createNewCertificate({ certificateType, patientId: patient.personId.id }))
      }
    }
  }

  return (
    <>
      {patient && (
        <>
          <DeathCertificateConfirmModal patient={patient} setOpen={setShowDeathCertificateModal} open={showDeathCertificateModal} />
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
            <FontAwesomeIcon
              icon={favorite ? starChecked : star}
              className={classnames({ 'iu-color-information': favorite, 'iu-color-muted': !favorite })}
            />
          </Star>
          <CertificateName>
            <span className="iu-fw-bold">{certificateName}</span> {issuerTypeId}
          </CertificateName>
          <TextWithInfoModal text="Om intyget" modalTitle={`Om ${certificateName}`} className="iu-mr-1rem">
            {hasDynamicLink(certificateInfo) ? (
              <ModalContent>{formatText(certificateInfo)}</ModalContent>
            ) : (
              <ModalContent dangerouslySetInnerHTML={sanitizeText(certificateInfo)} />
            )}
          </TextWithInfoModal>
          {createCertificateLink && (
            <CreateCertificateButton
              id={id}
              onClick={(certificateType: string) => {
                handleCreateCertificate(certificateType, links)
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
