import { Typography, Link } from '@material-ui/core'
import React from 'react'
import CertificateHeaderStatus from './CertificateHeaderStatus'
import { CertificateMetadata, TextWithInfoModal, isRevoked } from '@frontend/common'

interface Props {
  certificateMetadata: CertificateMetadata
}

const RevokedStatus: React.FC<Props> = ({ certificateMetadata }) => {
  if (!isRevoked(certificateMetadata)) return null

  return (
    <CertificateHeaderStatus icon={'ErrorOutlineIcon'}>
      <TextWithInfoModal text="Intyget är makulerat" modalTitle="Intyget är makulerat">
        <Typography>
          Intyget är inte längre tillgängligt för patienten i Mina intyg, som nås via{' '}
          <Link style={{ textDecoration: 'underline' }} href="https://minaintyg.se/">
            minaintyg.se
          </Link>
        </Typography>
      </TextWithInfoModal>
    </CertificateHeaderStatus>
  )
}

export default RevokedStatus
