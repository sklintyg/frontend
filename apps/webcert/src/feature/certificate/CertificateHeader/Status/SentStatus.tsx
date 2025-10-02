import StatusWithIcon from '../../../../components/utils/StatusWithIcon'
import type { CertificateMetadata } from '../../../../types'

interface Props {
  certificateMetadata: CertificateMetadata
}

const SentStatus = ({ certificateMetadata }: Props) => {
  return <StatusWithIcon icon={'CheckIcon'}>Intyget är skickat till {certificateMetadata.sentTo}</StatusWithIcon>
}

export default SentStatus
