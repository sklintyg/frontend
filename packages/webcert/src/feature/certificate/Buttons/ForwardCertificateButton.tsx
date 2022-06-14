import { ButtonWithConfirmModal, CustomButton } from '@frontend/common'
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
}) => {
  const dispatch = useDispatch()

  const handleEmailSend = () => {
    const href = `mailto:?subject=Du%20har%20blivit%20tilldelad%20ett%20ej%20signerat%20utkast%20i%20Webcert%20p%C3%A5%20enhet%20${unitName}%20f%C3%B6r%20v%C3%A5rdgivare%20${careProviderName}&body=Klicka%20p%C3%A5%20l%C3%A4nken%20f%C3%B6r%20att%20g%C3%A5%20till%20utkastet%3A%20http%3A%2F%2Flocalhost%3A3000%2Fcertificate%2F${certificateId}%0D%0AOBS!%20S%C3%A4tt%20i%20ditt%20SITHS-kort%20innan%20du%20klickar%20p%C3%A5%20l%C3%A4nken.%20`
    window.location.href = href
  }

  if (forwarded) {
    return (
      <CustomButton
        buttonStyle="primary"
        disabled={!enabled}
        onClick={handleEmailSend}
        tooltip={description}
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
      onConfirm={() => dispatch(forwardCertificate(true))}
      onClick={handleEmailSend}
      confirmButtonText="Ja"
      declineButtonText="Nej"
      confirmButtonDisabled={functionDisabled}>
      <p>Vill du markera utkastet som vidarebefordrat?</p>
    </ButtonWithConfirmModal>
  )
}

export default ForwardCertificateButton
