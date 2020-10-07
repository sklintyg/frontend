import { CertificateMetadata, CertificateStatus } from '@frontend/common'
import React from 'react'
import CertificateHeaderStatus from './CertificateHeaderStatus'

interface Props {
  certificateMetadata: CertificateMetadata
  isValidating: boolean
}

const DraftSavedStatus: React.FC<Props> = ({ certificateMetadata, isValidating }) => {
  if (!(certificateMetadata.certificateStatus === CertificateStatus.UNSIGNED) || isValidating) return null

  return <CertificateHeaderStatus icon={'CheckIcon'}>Utkastet är sparat</CertificateHeaderStatus>
}

export default DraftSavedStatus
