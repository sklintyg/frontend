import type React from 'react'
import TextWithInfoModal from '../../../../components/utils/Modal/TextWithInfoModal'
import StatusWithIcon from '../../../../components/utils/StatusWithIcon'
import type { CertificateMetadata } from '../../../../types'
import { isLockedRevoked } from '../../../../utils'

interface Props {
  certificateMetadata: CertificateMetadata
}

const LockedStatus: React.FC<Props> = ({ certificateMetadata }) => {
  const isDraftLockedRevoked = isLockedRevoked(certificateMetadata)

  return isDraftLockedRevoked ? (
    <StatusWithIcon icon={'ErrorOutlineIcon'} additionalTextStyles={'iu-color-error'}>
      Utkastet är makulerat
    </StatusWithIcon>
  ) : (
    <StatusWithIcon icon={'ErrorOutlineIcon'} additionalTextStyles={'iu-color-error'} isModal>
      <TextWithInfoModal text="Utkastet är låst" modalTitle="Utkastet är låst" className="iu-color-error">
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
