import React from 'react'
import { CertificateEvent, CertificateEventType, CertificateStatus, StatusWithIcon } from '@frontend/common/src'
import { Link } from 'react-router-dom'

interface Props {
  historyEntries: CertificateEvent[]
}

const HasBeenComplementedStatus: React.FC<Props> = ({ historyEntries }) => {
  const certificateEvent = historyEntries.find((c) => c.type === CertificateEventType.COMPLEMENTED)

  if (!certificateEvent) {
    return null
  }

  const getText = () => {
    const relatedCertificateStatus = certificateEvent.relatedCertificateStatus
    switch (relatedCertificateStatus) {
      case CertificateStatus.UNSIGNED:
        return 'Det finns redan en påbörjad komplettering.'
      case CertificateStatus.SIGNED:
        return 'Intyget har kompletterats med ett annat intyg.'
    }
  }

  const getLink = () => {
    const relatedCertificateStatus = certificateEvent.relatedCertificateStatus
    switch (relatedCertificateStatus) {
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
      {getText()} <Link to={`/certificate/${certificateEvent.relatedCertificateId}`}>{getLink()}</Link>
    </StatusWithIcon>
  )
}

export default HasBeenComplementedStatus
