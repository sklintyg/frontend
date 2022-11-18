import { CustomButton, ResourceLink } from '@frontend/common'
import file from '@frontend/common/src/images/file.svg'
import React from 'react'
import { useSelector } from 'react-redux'
import { loadingCertificateTypes } from '../../store/patient/patientSelectors'

interface Props extends ResourceLink {
  id: string
  onClick: (...args: string[]) => void
}

export const CreateCertificateButton: React.FC<Props> = ({ onClick, id, description, enabled, name }) => {
  const isLoadingCertificateTypes = useSelector(loadingCertificateTypes)

  return (
    <CustomButton
      buttonStyle="primary"
      onClick={() => onClick(id)}
      startIcon={<img src={file} alt={description} />}
      disabled={isLoadingCertificateTypes || !enabled}
      text={name}
      tooltip={description}
    />
  )
}
