import { CustomButton } from '../../../components/Inputs/CustomButton'
import ButtonWithConfirmModal from '../../../components/utils/Modal/ButtonWithConfirmModal'
import { ShareIcon } from '../../../images'
import { forwardCertificate } from '../../../store/certificate/certificateActions'
import { useAppDispatch, useAppSelector } from '../../../store/store'
import { getConfig } from '../../../store/utils/utilsSelectors'
import { ResourceLinkType } from '../../../types'
import type { FunctionDisabled } from '../../../utils/functionDisablerUtils'

interface Props extends FunctionDisabled {
  name: string
  description: string
  enabled: boolean
  unitName: string
  careProviderName: string
  forwarded: boolean
  certificateId: string
  type: ResourceLinkType
  certificateType: string
}

function ForwardCertificateButton({
  name,
  description,
  enabled,
  functionDisabled,
  unitName,
  careProviderName,
  forwarded,
  certificateId,
  type,
}: Props) {
  const dispatch = useAppDispatch()
  const config = useAppSelector(getConfig)

  const subject = encodeURIComponent(
    type === ResourceLinkType.FORWARD_CERTIFICATE
      ? `Du har blivit tilldelad ett ej signerat utkast i Webcert på enhet ${unitName} för vårdgivare ${careProviderName}`
      : `Ett ärende ska hanteras i Webcert på enhet ${unitName} för vårdgivare ${careProviderName}`
  )
  const url = `${config.forwardDraftOrQuestionUrl}${certificateId}${type !== ResourceLinkType.FORWARD_CERTIFICATE ? '/questions' : ''}`

  const body = encodeURIComponent(
    `Klicka på länken för att ${
      type === ResourceLinkType.FORWARD_CERTIFICATE ? 'gå till utkastet' : 'hantera ärendet'
    }: ${url}\r\nOBS! Sätt i ditt SITHS-kort innan du klickar på länken.`
  )

  const handleEmailSend = () => {
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
  }

  if (forwarded) {
    return (
      <CustomButton
        buttonStyle="primary"
        disabled={!enabled}
        onClick={handleEmailSend}
        tooltip={description}
        data-testid="forward-certificate-button"
        startIcon={<ShareIcon size="lg" />}
      >
        {name}
      </CustomButton>
    )
  }

  return (
    <ButtonWithConfirmModal
      disabled={!enabled}
      description={description}
      name={name}
      startIcon={<ShareIcon size="lg" />}
      modalTitle="Markera som vidarebefordrad?"
      onConfirm={() => dispatch(forwardCertificate({ certificateId: certificateId, forward: true }))}
      onClick={handleEmailSend}
      confirmButtonText="Ja"
      declineButtonText="Nej"
      buttonTestId="forward-certificate-button"
      confirmButtonDisabled={functionDisabled}
    >
      <p>Vill du markera {type === ResourceLinkType.FORWARD_CERTIFICATE ? 'utkastet' : 'ärendet'} som vidarebefordrat?</p>
    </ButtonWithConfirmModal>
  )
}

export default ForwardCertificateButton
