import React from 'react'
import { CertificateStatus, isSigned } from '../..'

export interface CertificateHeaderProps {
  id: string
  status: CertificateStatus
}

const CertificateHeader: React.FC<CertificateHeaderProps> = ({ id, status }) => {
  return (
    <div>
      <h1>{id}</h1>
      <h5>{isSigned(status) && 'Signerad!'}</h5>
    </div>
  )
}

export default CertificateHeader
