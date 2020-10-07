import { Typography, Link } from '@material-ui/core'
import React from 'react'
import CertificateHeaderStatus from './CertificateHeaderStatus'
import { CertificateMetadata, CertificateStatus, TextWithInfoModal } from '@frontend/common'

interface Props {
  certificateMetadata: CertificateMetadata
}

const RevokedCertificateStatus: React.FC<Props> = ({ certificateMetadata }) => {
  if (!(certificateMetadata.certificateStatus == CertificateStatus.INVALIDATED)) return null

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

export default RevokedCertificateStatus
