import React from 'react'
import { CertificateMetadata, isReplaced, isSigned } from '@frontend/common'
import CertificateHeaderStatus from './CertificateHeaderStatus'

interface Props {
  certificateMetadata: CertificateMetadata
}

const SentStatus: React.FC<Props> = ({ certificateMetadata }) => {
  if (!isSigned(certificateMetadata) || isReplaced(certificateMetadata)) return null

  return <CertificateHeaderStatus icon={'CheckIcon'}>Intyget är skickat till Arbetsförmedlingen</CertificateHeaderStatus>
}

export default SentStatus
