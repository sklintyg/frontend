import React from 'react'
import { signCertificate } from '../../../store/certificate/certificateActions'
import BorderColorIcon from '@material-ui/icons/BorderColor'
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
      style="success"
      text={name}
      startIcon={<BorderColorIcon />}
      disabled={isValidating || !enabled}
      onClick={() => {
        dispatch(signCertificate())
      }}></CustomButton>
  )
}

export default SignAndSendButton
