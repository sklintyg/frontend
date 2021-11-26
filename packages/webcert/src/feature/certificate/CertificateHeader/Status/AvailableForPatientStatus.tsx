import React from 'react'
import { CertificateMetadata, isSigned, TextWithInfoModal, StatusWithIcon } from '@frontend/common'
import WCDynamicLink from '../../../../components/utils/WCDynamicLink'

interface Props {
  certificateMetadata: CertificateMetadata
}

const AvailableForPatientStatus: React.FC<Props> = ({ certificateMetadata }) => {
  if (!isSigned(certificateMetadata)) return null
  const isLisjp = certificateMetadata.type === 'lisjp'

  return (
    <StatusWithIcon icon={'CheckIcon'} isModal={true}>
      <TextWithInfoModal text="Intyget är tillgängligt för patienten" modalTitle="Intyget är tillgängligt för patienten">
        <p>
          Intyget är tillgängligt för patienten i Mina intyg, som nås via <WCDynamicLink linkKey={'minaintyg'} />.
        </p>
        {isLisjp && (
          <>
            <p>Intyget går även att nå via Försäkringskassans e-tjänst för ansökan om sjukpenning.</p>
            <p>
              Om patienten inte har möjlighet att skicka intyget elektroniskt till Försäkringskassan kan du skicka intyget direkt till
              Försäkringskassan åt patienten.
            </p>
          </>
        )}
      </TextWithInfoModal>
    </StatusWithIcon>
  )
}

export default AvailableForPatientStatus
