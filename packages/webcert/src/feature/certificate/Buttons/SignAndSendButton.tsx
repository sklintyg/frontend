import React from 'react'
import { startSignCertificate } from '../../../store/certificate/certificateActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileSignature } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { getIsValidating } from '../../../store/certificate/certificateSelectors'
import { CustomButton } from '@frontend/common'

interface Props {
  name: string
  description: string
  enabled: boolean
}

const SignAndSendButton: React.FC<Props> = ({ name, description, enabled }) => {
  const dispatch = useDispatch()
  const isValidating = useSelector(getIsValidating)

  return (
    <CustomButton
      tooltip={description}
      buttonStyle="success"
      text={name}
      startIcon={<FontAwesomeIcon size="lg" icon={faFileSignature} />}
      disabled={isValidating || !enabled}
      onClick={() => {
        dispatch(startSignCertificate())
      }}></CustomButton>
  )
}

export default SignAndSendButton
