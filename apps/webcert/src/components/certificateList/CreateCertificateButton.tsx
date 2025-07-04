import { fileImage } from '../../images'
import type { ResourceLink } from '../../types'
import { CustomButton } from '../Inputs/CustomButton'

interface Props extends ResourceLink {
  id: string
  onClick: (...args: string[]) => void
  disabled: boolean
}

export const CreateCertificateButton = ({ onClick, id, description, enabled, name, disabled }: Props) => {
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
