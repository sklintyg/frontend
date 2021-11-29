import React from 'react'
import { CertificateRelation, CertificateStatus, StatusWithIcon } from '@frontend/common/src'
import { Link } from 'react-router-dom'

interface Props {
  relation: CertificateRelation | undefined
}

const HasBeenComplementedStatus: React.FC<Props> = ({ relation }) => {
  if (!relation) {
    return null
  }

  const getText = () => {
    const status = relation.status
    switch (status) {
      case CertificateStatus.UNSIGNED:
        return 'Det finns redan en påbörjad komplettering.'
      case CertificateStatus.SIGNED:
        return 'Intyget har kompletterats med ett annat intyg.'
    }
  }

  const getLink = () => {
    const status = relation.status
    switch (status) {
      case CertificateStatus.UNSIGNED:
        return 'Öppna utkastet.'
      case CertificateStatus.SIGNED:
        return 'Öppna intyget.'
      default:
        return ''
    }
  }

  return (
    <StatusWithIcon icon={'ErrorOutlineIcon'}>
      {getText()} <Link to={`/certificate/${relation.certificateId}`}>{getLink()}</Link>
    </StatusWithIcon>
  )
}

export default HasBeenComplementedStatus
