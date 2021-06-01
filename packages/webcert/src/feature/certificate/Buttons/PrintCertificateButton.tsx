import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { printCertificate } from '../../../store/certificate/certificateActions'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import { CustomButton } from '@frontend/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrint } from '@fortawesome/free-solid-svg-icons'

interface Props {
  name: string
  description: string
  enabled: boolean
}

const PrintCertificateButton: React.FC<Props> = ({ name, description, enabled }) => {
  const dispatch = useDispatch()
  const certificateMetadata = useSelector(getCertificateMetaData)

  if (!certificateMetadata) return null

  return (
    <CustomButton
      tooltip={description}
      disabled={!enabled}
      style="primary"
      text={name}
      startIcon={<FontAwesomeIcon icon={faPrint} size="lg"></FontAwesomeIcon>}
      onClick={() => dispatch(printCertificate(certificateMetadata))}
    />
  )
}

export default PrintCertificateButton
