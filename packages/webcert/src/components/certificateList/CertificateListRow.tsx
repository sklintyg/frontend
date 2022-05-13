import React from 'react'
import styled from 'styled-components'
import { CustomButton, ResourceLink, TextWithInfoModal } from '@frontend/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as star } from '@fortawesome/free-regular-svg-icons'
import { faStar as starChecked } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'

interface Props {
  certificateName: string
  certificateInfo: string
  id: string
  issuerTypeId: string
  preferenceClick: (...args: string[]) => void
  favorite: boolean
  createCertificate: (...args: string[]) => void
  link: ResourceLink
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
  createCertificate,
  link,
}) => {
  const favoriteText = favorite ? 'Ta bort som favoritmarkerat intyg.' : 'Markera intyget som favorit och fäst högst upp i listan.'
  const onPreferenceClick = () => {
    preferenceClick(id)
  }

  const onCreateCertificateClick = () => {
    createCertificate(id)
  }

  return (
    <Row className="iu-flex iu-flex-center iu-p-400">
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
        <ModalContent>{certificateInfo}</ModalContent>
      </TextWithInfoModal>
      <CustomButton
        buttonStyle="primary"
        onClick={onCreateCertificateClick}
        disabled={!link.enabled}
        text={link.name}
        tooltip={link.description}
      />
    </Row>
  )
}

export default CertificateListRow
