import { CertificateMetadata, CertificateStatus } from '@frontend/common'
import React from 'react'
import CertificateHeaderStatus from './CertificateHeaderStatus'

interface Props {
  isValidForSigning: boolean
  certificateMetadata: CertificateMetadata
}

const SignableStatus: React.FC<Props> = ({ isValidForSigning, certificateMetadata }) => {
  if (!(certificateMetadata.certificateStatus === CertificateStatus.UNSIGNED)) return null

  return (
    <CertificateHeaderStatus icon={isValidForSigning ? 'CheckIcon' : 'ErrorOutlineIcon'}>
      {isValidForSigning ? 'Klar att signera' : 'Obligatoriska uppgifter saknas'}
    </CertificateHeaderStatus>
  )
}

export default SignableStatus
