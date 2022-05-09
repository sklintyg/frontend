import React from 'react'
import { startSignCertificate } from '../../../store/certificate/certificateActions'
import { useDispatch, useSelector } from 'react-redux'
import { getIsValidating } from '../../../store/certificate/certificateSelectors'
import { CustomButton } from '@frontend/common'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'
import edit from '@frontend/common/src/images/edit.svg'

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
      startIcon={<img src={edit} alt="Logo Signera intyget" />}
      disabled={isValidating || !enabled || functionDisabled}
      onClick={() => {
        dispatch(startSignCertificate())
      }}
    />
  )
}

export default SignAndSendButton
