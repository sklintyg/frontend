import { CustomButton, fileImage, ResourceLink } from '@frontend/common'
import React from 'react'

interface Props extends ResourceLink {
  id: string
  onClick: (...args: string[]) => void
  disabled: boolean
}

export const CreateCertificateButton: React.FC<Props> = ({ onClick, id, description, enabled, name, disabled }) => {
  return (
    <CustomButton
      buttonStyle="primary"
      onClick={() => onClick(id)}
      startIcon={<img src={fileImage} alt={description} />}
      disabled={disabled || !enabled}
      text={name}
      tooltip={description}
    />
  )
}
