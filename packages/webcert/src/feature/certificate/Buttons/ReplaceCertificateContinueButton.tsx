import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from 'react-router-dom'
import { ButtonWithConfirmModal, CertificateMetadata, InfoBox } from '@frontend/common'

interface Props {
  name: string
  description: string
  enabled: boolean
  certificateMetadata: CertificateMetadata
}

const ReplaceCertificateContinueButton: React.FC<Props> = ({ name, description, enabled, certificateMetadata }) => {
  const history = useHistory()

  const handleConfirm = () => {
    history.push(`/certificate/${certificateMetadata.relations.children[0].certificateId}`)
  }

  return (
    <ButtonWithConfirmModal
      name={name}
      description={description}
      disabled={!enabled}
      startIcon={<FontAwesomeIcon size="lg" icon={faExchangeAlt} />}
      modalTitle="Ersätt intyg"
      onConfirm={handleConfirm}
      confirmButtonText={'Fortsätt på utkast'}>
      <>
        <InfoBox type="info">
          <p>Om intyget innehåller ett allvarligt fel, till exempel om det är utfärdat på fel patient, bör du istället makulera intyget.</p>
        </InfoBox>
        <p>
          Ett intyg kan ersättas om det innehåller felaktiga uppgifter eller om ny information tillkommit efter att intyget utfärdades. När
          ett intyg ersätts med ett nytt skapas ett utkast, med samma information som i det ursprungliga intyget, som du kan redigera innan
          du signerar intyget.
        </p>
      </>
    </ButtonWithConfirmModal>
  )
}

export default ReplaceCertificateContinueButton
