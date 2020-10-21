import { CertificateMetadata, isUnsigned, StatusWithIcon } from '@frontend/common'
import React from 'react'

interface Props {
  isValidForSigning: boolean
  certificateMetadata: CertificateMetadata
}

const SignableStatus: React.FC<Props> = ({ isValidForSigning, certificateMetadata }) => {
  if (!isUnsigned(certificateMetadata)) return null

  return (
    <StatusWithIcon icon={isValidForSigning ? 'CheckIcon' : 'ErrorOutlineIcon'}>
      {isValidForSigning ? 'Klart att signera' : 'Obligatoriska uppgifter saknas'}
    </StatusWithIcon>
  )
}

export default SignableStatus
