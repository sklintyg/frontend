import React from 'react'
import { CertificateMetadata, TextWithInfoModal, isRevoked, StatusWithIcon } from '@frontend/common'
import WCDynamicLink from '../../../../components/utils/WCDynamicLink'

interface Props {
  certificateMetadata: CertificateMetadata
}

const RevokedStatus: React.FC<Props> = ({ certificateMetadata }) => {
  if (!isRevoked(certificateMetadata)) return null

  return (
    <StatusWithIcon icon={'ErrorOutlineIcon'}>
      <TextWithInfoModal text="Intyget är makulerat" modalTitle="Intyget är makulerat">
        <p>
          Intyget är inte längre tillgängligt för patienten i Mina intyg, som nås via <WCDynamicLink linkKey="minaintyg" />
        </p>
      </TextWithInfoModal>
    </StatusWithIcon>
  )
}

export default RevokedStatus
