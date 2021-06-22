import { ButtonWithConfirmModal } from '@frontend/common'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { sendCertificate } from '../../../store/certificate/certificateActions'
import { useDispatch, useSelector } from 'react-redux'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'

interface Props {
  name: string
  description: string
  body?: string
  enabled: boolean
}

const SendCertificateButton: React.FC<Props> = ({ name, description, enabled, body }) => {
  const dispatch = useDispatch()
  const certificateMetadata = useSelector(getCertificateMetaData)

  if (!certificateMetadata) return null

  return (
    <ButtonWithConfirmModal
      disabled={!enabled}
      description={description}
      name={name}
      modalTitle={name}
      startIcon={<FontAwesomeIcon size="lg" icon={faEnvelope} />}
      onConfirm={() => {
        dispatch(sendCertificate(certificateMetadata.id))
      }}
      confirmButtonText={name}
      declineButtonText="Avbryt">
      {body && <div dangerouslySetInnerHTML={{ __html: body }}></div>}
    </ButtonWithConfirmModal>
  )
}

export default SendCertificateButton
