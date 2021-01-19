import React from 'react'
import { CertificateMetadata, isSigned, TextWithInfoModal, StatusWithIcon } from '@frontend/common'

interface Props {
  certificateMetadata: CertificateMetadata
}

const AvailableForPatientStatus: React.FC<Props> = ({ certificateMetadata }) => {
  if (!isSigned(certificateMetadata)) return null

  return (
    <StatusWithIcon icon={'CheckIcon'}>
      <TextWithInfoModal text="Intyget är tillgängligt för patienten" modalTitle="Intyget är tillgängligt för patienten">
        <p>
          Intyget är tillgängligt för patienten i Mina intyg, som nås via <a href="https://minaintyg.se/">minaintyg.se</a>
        </p>
      </TextWithInfoModal>
    </StatusWithIcon>
  )
}

export default AvailableForPatientStatus
