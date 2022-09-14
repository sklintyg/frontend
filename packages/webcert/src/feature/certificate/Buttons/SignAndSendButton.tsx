import { CustomButton } from '@frontend/common'
import edit from '@frontend/common/src/images/edit.svg'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CertificateSignStatus, startSignCertificate } from '../../../store/certificate/certificateActions'
import { getIsValidating, getSigningStatus } from '../../../store/certificate/certificateSelectors'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'

interface Props extends FunctionDisabled {
  name: string
  description: string
  enabled: boolean
}

const SignAndSendButton: React.FC<Props> = ({ name, description, enabled, functionDisabled }) => {
  const dispatch = useDispatch()
  const isValidating = useSelector(getIsValidating)
  const isSigning = useSelector(getSigningStatus) !== CertificateSignStatus.INITIAL

  return (
    <CustomButton
      tooltip={description}
      buttonStyle="primary"
      text={name}
      startIcon={<img src={edit} alt="Signera intyget" />}
      disabled={isValidating || isSigning || !enabled || functionDisabled}
      onClick={() => {
        dispatch(startSignCertificate())
      }}
    />
  )
}

export default SignAndSendButton
