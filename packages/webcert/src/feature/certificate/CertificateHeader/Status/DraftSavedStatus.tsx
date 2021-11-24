import { CertificateMetadata, isDraftSaved, StatusWithIcon } from '@frontend/common'
import React from 'react'
import { isDraft } from '@frontend/common/src'

interface Props {
  certificateMetadata: CertificateMetadata
  isValidating: boolean
  isEditable: boolean
}

const DraftSavedStatus: React.FC<Props> = ({ certificateMetadata, isValidating, isEditable }) => {
  if (!isDraft(certificateMetadata) || !isEditable) return null

  return (
    <StatusWithIcon icon={'CheckIcon'}>
      {isDraftSaved(certificateMetadata, isValidating) ? 'Utkastet är sparat' : 'Utkastet sparas'}
    </StatusWithIcon>
  )
}

export default DraftSavedStatus
