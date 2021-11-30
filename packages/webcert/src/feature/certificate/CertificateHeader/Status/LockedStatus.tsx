import { CertificateMetadata, StatusWithIcon, TextWithInfoModal, isDisabled } from '@frontend/common'
import React from 'react'
import { isLockedRevoked } from '@frontend/common/src'

interface Props {
  certificateMetadata: CertificateMetadata
}

const LockedStatus: React.FC<Props> = ({ certificateMetadata }) => {
  const isDraftLockedRevoked = isLockedRevoked(certificateMetadata)

  return isDraftLockedRevoked ? (
    <StatusWithIcon icon={'ErrorOutlineIcon'}>Utkastet är makulerat</StatusWithIcon>
  ) : (
    <StatusWithIcon icon={'ErrorOutlineIcon'} isModal>
      <TextWithInfoModal text="Utkastet är låst" modalTitle="Utkastet är låst">
        <p>Det har gått fler än fjorton dagar sedan det här utkastet skapades. Det har därför låsts.</p>
        <p>
          Intyg, inklusive utkast, betraktas som journalhandlingar vilket innebär att Patiendatalagen och Socialstyrelsens föreskrifter om
          journalföring gäller för alla intyg och utkast som hanteras av Webcert.
        </p>
      </TextWithInfoModal>
    </StatusWithIcon>
  )
}

export default LockedStatus
