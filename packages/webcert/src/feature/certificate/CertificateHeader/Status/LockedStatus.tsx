import { CertificateMetadata, StatusWithIcon, TextWithInfoModal, isDisabled } from '@frontend/common'
import { Typography } from '@material-ui/core'
import React from 'react'

interface Props {
  certificateMetadata: CertificateMetadata
}

const LockedStatus: React.FC<Props> = ({ certificateMetadata }) => {
  if (!isDisabled(certificateMetadata)) return null

  return (
    <StatusWithIcon icon={'ErrorOutlineIcon'}>
      <TextWithInfoModal text="Utkastet är låst" modalTitle="Utkastet är låst">
        <Typography>Det har gått fler än fjorton dagar sedan det här utkastet skapades. Det har därför låsts.</Typography>
        <Typography>
          Intyg, inklusive utkast, betraktas som journalhandlingar vilket innebär att Patiendatalagen och Socialstyrelsens föreskrifter om
          journalföring gäller för alla intyg och utkast som hanteras av Webcert.
        </Typography>
      </TextWithInfoModal>
    </StatusWithIcon>
  )
}

export default LockedStatus
