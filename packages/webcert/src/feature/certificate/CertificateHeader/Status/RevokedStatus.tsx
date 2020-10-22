import { Typography, Link } from '@material-ui/core'
import React from 'react'
import { CertificateMetadata, TextWithInfoModal, isRevoked, StatusWithIcon } from '@frontend/common'

interface Props {
  certificateMetadata: CertificateMetadata
}

const RevokedStatus: React.FC<Props> = ({ certificateMetadata }) => {
  if (!isRevoked(certificateMetadata)) return null

  return (
    <StatusWithIcon icon={'ErrorOutlineIcon'}>
      <TextWithInfoModal text="Intyget är makulerat" modalTitle="Intyget är makulerat">
        <Typography>
          Intyget är inte längre tillgängligt för patienten i Mina intyg, som nås via{' '}
          <Link style={{ textDecoration: 'underline' }} href="https://minaintyg.se/">
            minaintyg.se
          </Link>
        </Typography>
      </TextWithInfoModal>
    </StatusWithIcon>
  )
}

export default RevokedStatus
