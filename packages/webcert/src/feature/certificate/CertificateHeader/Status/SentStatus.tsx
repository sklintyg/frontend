import React from 'react'
import { CertificateMetadata, StatusWithIcon } from '@frontend/common'

interface Props {
  certificateMetadata: CertificateMetadata
}

const SentStatus: React.FC<Props> = ({ certificateMetadata }) => {
  return (
    <StatusWithIcon icon={'CheckIcon'}>
      Intyget är skickat till {certificateMetadata.type === 'lisjp' ? 'Försäkringskassan' : 'Arbetsförmedlingen'}
    </StatusWithIcon>
  )
}

export default SentStatus
