import React from 'react'
import { CertificateMetadata, isRevoked, isHasParent, isParentRevoked, StatusWithIcon, isParentLocked } from '@frontend/common'
import { Link } from 'react-router-dom'

interface Props {
  certificateMetadata: CertificateMetadata
}

const RevokeParentStatus: React.FC<Props> = ({ certificateMetadata }) => {
  if (!isRevoked(certificateMetadata) || !isHasParent(certificateMetadata) || isParentRevoked(certificateMetadata)) return null

  const parentLocked = isParentLocked(certificateMetadata)

  return (
    <StatusWithIcon icon={'ErrorOutlineIcon'}>
      Intyget ersatte ett tidigare {parentLocked ? 'utkast' : 'intyg'} som också kan behöva makuleras.{' '}
      <Link to={`/certificate/${certificateMetadata.relations.parent!.certificateId}`}>Öppna {parentLocked ? 'utkastet' : 'intyget'}</Link>
    </StatusWithIcon>
  )
}

export default RevokeParentStatus
