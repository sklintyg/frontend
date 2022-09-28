import { CustomButton, ResourceLink } from '@frontend/common'
import file from '@frontend/common/src/images/file.svg'
import React from 'react'

interface Props extends ResourceLink {
  id: string
  onClick: (...args: string[]) => void
}

export const CreateCertificateButton: React.FC<Props> = ({ onClick, id, description, enabled, name }) => (
  <CustomButton
    buttonStyle="primary"
    onClick={() => onClick(id)}
    startIcon={<img src={file} alt={description} />}
    disabled={!enabled}
    text={name}
    tooltip={description}
  />
)
