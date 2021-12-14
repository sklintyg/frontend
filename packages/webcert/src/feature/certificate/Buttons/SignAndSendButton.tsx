import React from 'react'
import { startSignCertificate } from '../../../store/certificate/certificateActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileSignature } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { getIsValidating } from '../../../store/certificate/certificateSelectors'
import { CustomButton } from '@frontend/common'
import { FunctionDisabled } from '../../../components/utils/functionDisablerUtils'

interface Props extends FunctionDisabled {
  name: string
  description: string
  enabled: boolean
}

const SignAndSendButton: React.FC<Props> = ({ name, description, enabled, functionDisabled }) => {
  const dispatch = useDispatch()
  const isValidating = useSelector(getIsValidating)

  return (
    <CustomButton
      tooltip={description}
      buttonStyle="primary"
      text={name}
      startIcon={<FontAwesomeIcon size="lg" icon={faFileSignature} />}
      disabled={isValidating || !enabled || functionDisabled}
      onClick={() => {
        dispatch(startSignCertificate())
      }}
    />
  )
}

export default SignAndSendButton
