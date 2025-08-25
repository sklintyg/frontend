import { useDispatch } from 'react-redux'
import { showRelatedCertificate } from '../../../store/certificate/certificateActions'
import type { FunctionDisabled } from '../../../utils/functionDisablerUtils'
import { CustomButton } from '../../../components/Inputs/CustomButton'
import { fileImage } from '../../../images'

interface Props extends FunctionDisabled {
  name: string
  description: string
  enabled: boolean
  certificateId: string
}

const ShowRelatedCertificateButton = ({ name, description, enabled, certificateId }: Props) => {
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(showRelatedCertificate({ certificateId: certificateId }))
  }

  return (
    <CustomButton
      tooltip={description}
      disabled={!enabled}
      startIcon={<img src={fileImage} alt={description} />}
      buttonStyle="primary"
      text={name}
      onClick={handleClick}
    />
  )
}

export default ShowRelatedCertificateButton
