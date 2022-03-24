import { ButtonWithConfirmModal, CustomButton } from '@frontend/common'
import React from 'react'
import { forwardCertificate } from '../../../store/certificate/certificateActions'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply } from '@fortawesome/free-solid-svg-icons'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import _ from 'lodash'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'

interface Props extends FunctionDisabled {
  name: string
  description: string
  enabled: boolean
}

const ForwardCertificateButton: React.FC<Props> = ({ name, description, enabled, functionDisabled }) => {
  const dispatch = useDispatch()
  const metadata = useSelector(getCertificateMetaData, _.isEqual)

  if (!metadata) return null

  const handleEmailSend = () => {
    const href = `mailto:?subject=Du%20har%20blivit%20tilldelad%20ett%20ej%20signerat%20utkast%20i%20Webcert%20p%C3%A5%20enhet%20${metadata.unit.unitName}%20f%C3%B6r%20v%C3%A5rdgivare%20${metadata.careProvider.unitName}&body=Klicka%20p%C3%A5%20l%C3%A4nken%20f%C3%B6r%20att%20g%C3%A5%20till%20utkastet%3A%20http%3A%2F%2Flocalhost%3A3000%2Fcertificate%2F${metadata.id}%0D%0AOBS!%20S%C3%A4tt%20i%20ditt%20SITHS-kort%20innan%20du%20klickar%20p%C3%A5%20l%C3%A4nken.%20`
    window.location.href = href
  }
  //startIcon={<ReplyIcon style={{ transform: 'scaleX(-1)' }} />}
  if (metadata.forwarded) {
    return (
      <CustomButton disabled={!enabled} onClick={handleEmailSend} tooltip={description}>
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
