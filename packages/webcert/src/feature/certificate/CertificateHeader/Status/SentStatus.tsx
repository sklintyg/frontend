import React from 'react'
import { CertificateMetadata, isReplaced, isSigned, StatusWithIcon } from '@frontend/common'

interface Props {
  certificateMetadata: CertificateMetadata
}

const SentStatus: React.FC<Props> = ({ certificateMetadata }) => {
  if (!isSigned(certificateMetadata) || isReplaced(certificateMetadata)) return null

  return <StatusWithIcon icon={'CheckIcon'}>Intyget är skickat till Arbetsförmedlingen</StatusWithIcon>
}

export default SentStatus
