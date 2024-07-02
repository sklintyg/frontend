import type React from 'react'
import { useDispatch } from 'react-redux'
import { forwardCertificate } from '../../../store/certificate/certificateActions'
import type { FunctionDisabled } from '../../../utils/functionDisablerUtils'
import { CustomButton } from '../../../components/Inputs/CustomButton'
import ButtonWithConfirmModal from '../../../components/utils/Modal/ButtonWithConfirmModal'
import { ShareIcon } from '../../../images'
import { ResourceLinkType } from '../../../types'

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

const ForwardCertificateButton: React.FC<Props> = ({
  name,
  description,
  enabled,
  functionDisabled,
  unitName,
  careProviderName,
  forwarded,
  certificateId,
  certificateType,
  type,
}) => {
  const dispatch = useDispatch()

  const getSubject = (unitName: string, careProviderName: string) =>
    encodeURIComponent(
      type === ResourceLinkType.FORWARD_CERTIFICATE
        ? `Du har blivit tilldelad ett ej signerat utkast i Webcert på enhet ${unitName} för vårdgivare ${careProviderName}`
        : `Ett ärende ska hanteras i Webcert på enhet ${unitName} för vårdgivare ${careProviderName}`
    )

  const getBody = (certificateUrl: string) =>
    encodeURIComponent(
      `Klicka på länken för att ${
        type === ResourceLinkType.FORWARD_CERTIFICATE ? 'gå till utkastet' : 'hantera ärendet'
      }: ${certificateUrl}\r\nOBS! Sätt i ditt SITHS-kort innan du klickar på länken.`
    )

  const handleEmailSend = () => {
    const certificateUrl = `${window.location.protocol}//${window.location.host.replace(
      'wc2.',
      ''
    )}/webcert/web/user/basic-certificate/${certificateType}/${certificateId}/questions`
    const subject = getSubject(unitName, careProviderName)
    const body = getBody(certificateUrl)
    const href = `mailto:?subject=${subject}&body=${body}`
    window.open(href, '_blank')
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
