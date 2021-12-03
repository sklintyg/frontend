import React from 'react'
import { useDispatch } from 'react-redux'
import { printCertificate } from '../../../store/certificate/certificateActions'
import { CertificateMetadata, CustomButton } from '@frontend/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrint } from '@fortawesome/free-solid-svg-icons'
import { ButtonWithConfirmModal } from '@frontend/common/src'

interface Props {
  name: string
  description: string
  enabled: boolean
  body?: string
  certificateMetadata: CertificateMetadata
}

const PrintCertificateButton: React.FC<Props> = ({ name, description, enabled, certificateMetadata, body }) => {
  const dispatch = useDispatch()

  return (
    <>
      {body ? (
        <ButtonWithConfirmModal
          description={description}
          disabled={!enabled}
          buttonStyle="primary"
          name={name}
          modalTitle={'Skriv ut utkast'}
          startIcon={<FontAwesomeIcon icon={faPrint} size="lg"></FontAwesomeIcon>}
          onConfirm={() => dispatch(printCertificate(certificateMetadata))}
          confirmButtonText={'Skriv ut'}>
          <div dangerouslySetInnerHTML={{ __html: body }}></div>
        </ButtonWithConfirmModal>
      ) : (
        <CustomButton
          tooltip={description}
          disabled={!enabled}
          buttonStyle="primary"
          text={name}
          startIcon={<FontAwesomeIcon icon={faPrint} size="lg"></FontAwesomeIcon>}
          onClick={() => dispatch(printCertificate(certificateMetadata))}
        />
      )}
    </>
  )
}

export default PrintCertificateButton
