import { CertificateMetadata, isDraftSaved, StatusWithIcon } from '@frontend/common'
import React from 'react'

interface Props {
  certificateMetadata: CertificateMetadata
  isValidating: boolean
  isEditable: boolean
}

const DraftSavedStatus: React.FC<Props> = ({ certificateMetadata, isValidating, isEditable }) => {
  console.log(isDraftSaved(certificateMetadata, isValidating) || !isEditable)
  if (!isDraftSaved(certificateMetadata, isValidating) || !isEditable) return null

  return <StatusWithIcon icon={'CheckIcon'}>Utkastet är sparat</StatusWithIcon>
}

export default DraftSavedStatus
