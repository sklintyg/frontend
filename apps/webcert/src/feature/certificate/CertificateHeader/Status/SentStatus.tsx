import React from 'react'
import StatusWithIcon from '../../../../components/utils/StatusWithIcon'
import { CertificateMetadata } from '../../../../types'

interface Props {
  certificateMetadata: CertificateMetadata
}

const SentStatus: React.FC<Props> = ({ certificateMetadata }) => {
  return <StatusWithIcon icon={'CheckIcon'}>Intyget är skickat till {certificateMetadata.sentTo}</StatusWithIcon>
}

export default SentStatus
