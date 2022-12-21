import { CertificateMetadata, StatusWithIcon } from '@frontend/common'
import React from 'react'

interface Props {
  certificateMetadata: CertificateMetadata
}

const SentStatus: React.FC<Props> = ({ certificateMetadata }) => {
  return <StatusWithIcon icon={'CheckIcon'}>Intyget är skickat till {certificateMetadata.sentTo}</StatusWithIcon>
}

export default SentStatus
