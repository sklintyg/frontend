import { ButtonWithConfirmModal, CustomButton, ResourceLinkType } from '@frontend/common'
import React from 'react'
import { forwardCertificate } from '../../../store/certificate/certificateActions'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply } from '@fortawesome/free-solid-svg-icons'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'

interface Props extends FunctionDisabled {
  name: string
  description: string
  enabled: boolean
  unitName: string
  careProviderName: string
  forwarded: boolean
  certificateId: string
  type: ResourceLinkType
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
    const certificateUrl = `${window.location.protocol}//${window.location.host}/certificate/${certificateId}`
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
        startIcon={<FontAwesomeIcon size="lg" icon={faReply} />}>
        {name}
      </CustomButton>
    )
  }

  return (
    <ButtonWithConfirmModal
      disabled={!enabled}
      description={description}
      name={name}
      startIcon={<FontAwesomeIcon size="lg" icon={faReply} />}
      modalTitle="Markera som vidarebefordrad?"
      onConfirm={() => dispatch(forwardCertificate({ certificateId: certificateId, forward: true }))}
      onClick={handleEmailSend}
      confirmButtonText="Ja"
      declineButtonText="Nej"
      buttonTestId="forward-certificate-button"
      confirmButtonDisabled={functionDisabled}>
      <p>Vill du markera {type === ResourceLinkType.FORWARD_CERTIFICATE ? 'utkastet' : 'ärendet'} som vidarebefordrat?</p>
    </ButtonWithConfirmModal>
  )
}

export default ForwardCertificateButton
