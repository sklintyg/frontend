import {
  CertificateMetadata,
  isReplaced,
  getReplacedCertificateStatus,
  CertificateStatus,
  StatusWithIcon,
  isLocked,
} from '@frontend/common'
import React from 'react'
import { Link } from 'react-router-dom'

interface Props {
  certificateMetadata: CertificateMetadata
}

const ReplacedStatus: React.FC<Props> = ({ certificateMetadata }) => {
  if (!isReplaced(certificateMetadata)) return null

  const replacedCertificateStatus = getReplacedCertificateStatus(certificateMetadata)

  if (replacedCertificateStatus !== CertificateStatus.SIGNED && certificateMetadata.status === CertificateStatus.REVOKED) {
    return null
  }

  const locked = isLocked(certificateMetadata)

  const getText = () => {
    switch (replacedCertificateStatus) {
      case CertificateStatus.SIGNED:
        return (
          <>
            {locked ? 'Utkastet' : 'Intyget'} har ersatts av{' '}
            <Link to={`/certificate/${certificateMetadata.relations.children[0].certificateId}`}>detta intyg</Link>
          </>
        )
      case CertificateStatus.UNSIGNED:
        return (
          <>
            Det finns redan ett påbörjat utkast som ska ersätta detta {locked ? 'utkast' : 'intyg'}.{' '}
            <Link to={`/certificate/${certificateMetadata.relations.children[0].certificateId}`}>Öppna utkastet</Link>
          </>
        )
      case CertificateStatus.REVOKED:
        return (
          <>
            {locked ? 'Utkastet' : 'Intyget'} ersattes av ett intyg som nu är makulerat.{' '}
            <Link to={`/certificate/${certificateMetadata.relations.children[0].certificateId}`}>Öppna intyget</Link>
          </>
        )
      case CertificateStatus.LOCKED || CertificateStatus.LOCKED_REVOKED:
        return (
          <>
            Utkastet ersattes av ett utkast som nu är låst.{' '}
            <Link to={`/certificate/${certificateMetadata.relations.children[0].certificateId}`}>Öppna utkastet</Link>
          </>
        )
    }
  }

  return <StatusWithIcon icon={'ErrorOutlineIcon'}>{getText()}</StatusWithIcon>
}

export default ReplacedStatus
