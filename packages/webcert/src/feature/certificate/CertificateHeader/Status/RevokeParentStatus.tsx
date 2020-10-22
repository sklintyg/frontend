import { Typography, Link } from '@material-ui/core'
import React from 'react'
import { CertificateMetadata, isRevoked, isHasParent, isParentRevoked, StatusWithIcon } from '@frontend/common'

interface Props {
  certificateMetadata: CertificateMetadata
}

const RevokeParentStatus: React.FC<Props> = ({ certificateMetadata }) => {
  if (!isRevoked(certificateMetadata) || !isHasParent(certificateMetadata) || isParentRevoked(certificateMetadata)) return null

  return (
    <StatusWithIcon icon={'ErrorOutlineIcon'}>
      Intyget ersatte ett tidigare intyg som också kan behöva makuleras.{' '}
      <Link style={{ textDecoration: 'underline' }} href={`/certificate/${certificateMetadata.relations.parent!.certificateId}`}>
        Öppna intyget
      </Link>
    </StatusWithIcon>
  )
}

export default RevokeParentStatus
