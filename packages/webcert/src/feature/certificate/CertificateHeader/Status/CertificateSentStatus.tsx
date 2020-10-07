import { CertificateMetadata, CertificateStatus } from '@frontend/common'
import React from 'react'
import CertificateHeaderStatus from './CertificateHeaderStatus'

interface Props {
  certificateMetadata: CertificateMetadata
}

const CertificateSentStatus: React.FC<Props> = ({ certificateMetadata }) => {
  if (!(certificateMetadata.certificateStatus === CertificateStatus.SIGNED)) return null

  return <CertificateHeaderStatus icon={'CheckIcon'}>Intyget är skickat till Arbetsförmedlingen</CertificateHeaderStatus>
}

export default CertificateSentStatus
