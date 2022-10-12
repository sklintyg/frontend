import React from 'react'
import styled from 'styled-components'
import { CustomButton, InfoBox, ResourceLink, sanitizeText, TextWithInfoModal } from '@frontend/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as star } from '@fortawesome/free-regular-svg-icons'
import { faStar as starChecked } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import WCDynamicLink from '../../utils/WCDynamicLink'
import file from '@frontend/common/src/images/file.svg'

interface Props {
  certificateName: string
  certificateInfo: string
  id: string
  issuerTypeId: string
  preferenceClick: (...args: string[]) => void
  favorite: boolean
  createCertificate: (...args: string[]) => void
  link?: ResourceLink
  message?: string
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
  message,
}) => {
  const favoriteText = favorite ? 'Ta bort som favoritmarkerat intyg.' : 'Markera intyget som favorit och fäst högst upp i listan.'
  const onPreferenceClick = () => {
    preferenceClick(id)
  }

  const onCreateCertificateClick = () => {
    createCertificate(id)
  }

  const formatText = (text: string) => {
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

  const hasDynamicLink = (text: string) => {
    if (!text) {
      return false
    }
    const splitText = text.split('<LINK:')
    return splitText.length > 1
  }

  return (
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
        {link && (
          <CustomButton
            buttonStyle="primary"
            onClick={onCreateCertificateClick}
            startIcon={<img src={file} alt={link?.description} />}
            disabled={!link?.enabled}
            text={link?.name}
            tooltip={link?.description}
          />
        )}
      </div>
      {message && (
        <div className="iu-pt-200">
          <InfoBox type={'info'}>{message}</InfoBox>
        </div>
      )}
    </Row>
  )
}

export default CertificateListRow
