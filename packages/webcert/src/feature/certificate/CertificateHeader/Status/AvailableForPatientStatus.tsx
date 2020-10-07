import { Typography, Link } from '@material-ui/core'
import React from 'react'
import CertificateHeaderStatus from './CertificateHeaderStatus'
import { CertificateMetadata, isSigned, TextWithInfoModal } from '@frontend/common'

interface Props {
  certificateMetadata: CertificateMetadata
}

const AvailableForPatientStatus: React.FC<Props> = ({ certificateMetadata }) => {
  if (!isSigned(certificateMetadata)) return null

  return (
    <CertificateHeaderStatus icon={'CheckIcon'}>
      <TextWithInfoModal text="Intyget är tillgängligt för patienten" modalTitle="Intyget är tillgängligt för patienten">
        <Typography>
          Intyget är tillgängligt för patienten i Mina intyg, som nås via{' '}
          <Link style={{ textDecoration: 'underline' }} href="https://minaintyg.se/">
            minaintyg.se
          </Link>
        </Typography>
      </TextWithInfoModal>
    </CertificateHeaderStatus>
  )
}

export default AvailableForPatientStatus
