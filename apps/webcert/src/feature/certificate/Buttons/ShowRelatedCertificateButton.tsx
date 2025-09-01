import { useDispatch } from 'react-redux'
import { CustomButton } from '../../../components/Inputs/CustomButton'
import { fileImage } from '../../../images'
import { showRelatedCertificate } from '../../../store/certificate/certificateActions'

interface Props {
  name: string
  description: string
  enabled: boolean
  certificateId: string
  functionDisabled: boolean
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
