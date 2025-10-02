import StatusWithIcon from '../../../../components/utils/StatusWithIcon'
import type { CertificateMetadata } from '../../../../types'
import { isDraftSaved } from '../../../../utils'

interface Props {
  certificateMetadata: CertificateMetadata
  isValidating: boolean
}

const DraftSavedStatus = ({ certificateMetadata, isValidating }: Props) => {
  return (
    <StatusWithIcon icon={'CheckIcon'}>
      {isDraftSaved(certificateMetadata, isValidating) ? 'Utkastet är sparat' : 'Utkastet sparas'}
    </StatusWithIcon>
  )
}

export default DraftSavedStatus
