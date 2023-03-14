import { CustomButton, fileImage } from '@frontend/common'
import * as React from 'react'
import { useDispatch } from 'react-redux'
import { showRelatedCertificate } from '../../../store/certificate/certificateActions'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'

interface Props extends FunctionDisabled {
  name: string
  description: string
  enabled: boolean
  certificateId: string
}

const ShowRelatedCertificateButton: React.FC<Props> = ({ name, description, enabled, certificateId }) => {
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
