import type React from 'react'
import StatusWithIcon from '../../../../components/utils/StatusWithIcon'
import type { CertificateMetadata } from '../../../../types'
import { isDraftSaved } from '../../../../utils'

interface Props {
  certificateMetadata: CertificateMetadata
  isValidating: boolean
}

const DraftSavedStatus: React.FC<Props> = ({ certificateMetadata, isValidating }) => {
  return (
    <StatusWithIcon icon={'CheckIcon'}>
      {isDraftSaved(certificateMetadata, isValidating) ? 'Utkastet är sparat' : 'Utkastet sparas'}
    </StatusWithIcon>
  )
}

export default DraftSavedStatus
