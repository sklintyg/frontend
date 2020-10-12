import { Typography, Link } from '@material-ui/core'
import React from 'react'
import CertificateHeaderStatus from './CertificateHeaderStatus'
import { CertificateMetadata, isRevoked, isHasParent, isParentRevoked } from '@frontend/common'

interface Props {
  certificateMetadata: CertificateMetadata
}

const RevokeParentStatus: React.FC<Props> = ({ certificateMetadata }) => {
  if (!isRevoked(certificateMetadata) || !isHasParent(certificateMetadata) || isParentRevoked(certificateMetadata)) return null

  return (
    <CertificateHeaderStatus icon={'ErrorOutlineIcon'}>
      Intyget ersatte ett tidigare intyg som också kan behöva makuleras.{' '}
      <Link style={{ textDecoration: 'underline' }} href={`/certificate/${certificateMetadata.relations.parent!.certificateId}`}>
        Öppna intyget
      </Link>
    </CertificateHeaderStatus>
  )
}

export default RevokeParentStatus
