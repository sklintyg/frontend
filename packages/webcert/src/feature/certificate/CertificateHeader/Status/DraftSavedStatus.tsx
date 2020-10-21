import { CertificateMetadata, isDraftSaved, StatusWithIcon } from '@frontend/common'
import React from 'react'

interface Props {
  certificateMetadata: CertificateMetadata
  isValidating: boolean
}

const DraftSavedStatus: React.FC<Props> = ({ certificateMetadata, isValidating }) => {
  if (!isDraftSaved(certificateMetadata, isValidating)) return null

  return <StatusWithIcon icon={'CheckIcon'}>Utkastet är sparat</StatusWithIcon>
}

export default DraftSavedStatus
