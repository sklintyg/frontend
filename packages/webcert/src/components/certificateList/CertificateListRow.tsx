import { faStar as star } from '@fortawesome/free-regular-svg-icons'
import { faStar as starChecked } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ResourceLink, sanitizeText, TextWithInfoModal } from '@frontend/common'
import classnames from 'classnames'
import React from 'react'
import styled from 'styled-components'
import WCDynamicLink from '../../utils/WCDynamicLink'

interface Props {
  certificateName: string
  certificateInfo: string
  id: string
  issuerTypeId: string
  preferenceClick: (...args: string[]) => void
  favorite: boolean
  link?: ResourceLink
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
  children,
}) => {
  const favoriteText = favorite ? 'Ta bort som favoritmarkerat intyg.' : 'Markera intyget som favorit och fäst högst upp i listan.'
  const onPreferenceClick = () => {
    preferenceClick(id)
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
        {hasDynamicLink(certificateInfo) ? (
          <ModalContent>{formatText(certificateInfo)}</ModalContent>
        ) : (
          <ModalContent dangerouslySetInnerHTML={sanitizeText(certificateInfo)} />
        )}
      </TextWithInfoModal>
      {children}
    </Row>
  )
}

export default CertificateListRow
