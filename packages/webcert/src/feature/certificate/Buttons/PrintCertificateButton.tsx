import React from 'react'
import { useDispatch } from 'react-redux'
import { printCertificate } from '../../../store/certificate/certificateActions'
import { CertificateMetadata, CustomButton } from '@frontend/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrint } from '@fortawesome/free-solid-svg-icons'

interface Props {
  name: string
  description: string
  enabled: boolean
  certificateMetadata: CertificateMetadata
}

const PrintCertificateButton: React.FC<Props> = ({ name, description, enabled, certificateMetadata }) => {
  const dispatch = useDispatch()

  return (
    <CustomButton
      tooltip={description}
      disabled={!enabled}
      buttonStyle="primary"
      text={name}
      startIcon={<FontAwesomeIcon icon={faPrint} size="lg"></FontAwesomeIcon>}
      onClick={() => dispatch(printCertificate(certificateMetadata))}
    />
  )
}

export default PrintCertificateButton
