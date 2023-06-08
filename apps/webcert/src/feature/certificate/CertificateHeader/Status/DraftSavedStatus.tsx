import { CertificateMetadata, isDraftSaved, StatusWithIcon } from '@frontend/common'
import React from 'react'

interface Props {
  certificateMetadata: CertificateMetadata
  isValidating: boolean
}

const DraftSavedStatus: React.FC<Props> = ({ certificateMetadata, isValidating }) => {
  return (
    <StatusWithIcon icon={'CheckIcon'}>
      {isDraftSaved(certificateMetadata, isValidating) ? 'Utkastet är sparat' : 'Utkastet sparas'}
    </StatusWithIcon>
  )
}

export default DraftSavedStatus
