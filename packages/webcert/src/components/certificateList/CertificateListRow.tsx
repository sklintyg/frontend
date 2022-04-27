import React from 'react'
import styled from 'styled-components'
import { CustomButton, TextWithInfoModal } from '@frontend/common'
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
  createDisabled: boolean
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

const CertificateListRow: React.FC<Props> = ({
  certificateName,
  certificateInfo,
  id,
  issuerTypeId,
  preferenceClick,
  favorite,
  createCertificate,
  createDisabled,
}) => {
  const onPreferenceClick = () => {
    preferenceClick(id)
  }

  const onCreateCertificateClick = () => {
    createCertificate(id)
  }

  return (
    <Row className="iu-flex iu-flex-center iu-p-400">
      <Star
        className="iu-mr-1rem"
        onClick={onPreferenceClick}
        data-tip={favorite ? 'Ta bort som favoritmarkerat intyg.' : 'Markera intyget som favorit och fäst högst upp i listan.'}>
        <FontAwesomeIcon
          icon={favorite ? starChecked : star}
          className={classnames({ 'iu-color-information': favorite, 'iu-color-muted': !favorite })}
        />
      </Star>
      <CertificateName>
        {certificateName} <span className="iu-color-muted">{issuerTypeId}</span>
      </CertificateName>
      <TextWithInfoModal text="Om intyget" modalTitle={`Om ${certificateName}`} className="iu-mr-1rem">
        {certificateInfo}
      </TextWithInfoModal>
      <CustomButton buttonStyle="primary" type="button" onClick={onCreateCertificateClick} disabled={createDisabled}>
        Skapa intyg
      </CustomButton>
    </Row>
  )
}

export default CertificateListRow
