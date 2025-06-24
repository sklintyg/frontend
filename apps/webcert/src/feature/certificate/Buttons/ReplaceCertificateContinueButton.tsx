import type React from 'react'
import { useNavigate } from 'react-router-dom'
import InfoBox from '../../../components/utils/InfoBox'
import ButtonWithConfirmModal from '../../../components/utils/Modal/ButtonWithConfirmModal'
import { DoubleArrowIcon } from '../../../images'
import type { CertificateMetadata } from '../../../types'
import type { FunctionDisabled } from '../../../utils/functionDisablerUtils'

interface Props extends FunctionDisabled {
  name: string
  description: string
  enabled: boolean
  certificateMetadata: CertificateMetadata
}

const ReplaceCertificateContinueButton: React.FC<Props> = ({ name, description, enabled, certificateMetadata, functionDisabled }) => {
  const navigate = useNavigate()

  const handleConfirm = () => {
    navigate(`/certificate/${certificateMetadata.relations.children[0].certificateId}`)
  }

  return (
    <ButtonWithConfirmModal
      name={name}
      description={description}
      disabled={!enabled}
      startIcon={<DoubleArrowIcon size="lg" />}
      modalTitle="Ersätt intyg"
      onConfirm={handleConfirm}
      confirmButtonText={'Fortsätt på utkast'}
      confirmButtonDisabled={functionDisabled}
      buttonTestId="replace-certificate-button"
    >
      <>
        <InfoBox type="info" activateIconWrap>
          <p>Om intyget innehåller ett allvarligt fel, till exempel om det är utfärdat på fel patient, bör du istället makulera intyget.</p>
        </InfoBox>
        <p>
          Ett intyg kan ersättas om det innehåller felaktiga uppgifter eller om ny information tillkommit efter att intyget utfärdades. När
          ett intyg ersätts med ett nytt skapas ett utkast, med samma information som i det ursprungliga intyget, som du kan redigera innan
          du signerar intyget.{' '}
        </p>
      </>
    </ButtonWithConfirmModal>
  )
}

export default ReplaceCertificateContinueButton
