import { CertificateSignStatus, ConfirmModal, CustomButton, ResourceLinkType } from '@frontend/common'
import edit from '@frontend/common/src/images/edit.svg'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { startSignCertificate } from '../../../store/certificate/certificateActions'
import { getIsValidating, getIsValidForSigning, getSigningStatus } from '../../../store/certificate/certificateSelectors'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'

interface Props extends FunctionDisabled {
  name: string
  description: string
  enabled: boolean
  body?: string
  type: ResourceLinkType
}

const SignAndSendButton: React.FC<Props> = ({ name, description, enabled, body, type, functionDisabled }) => {
  const dispatch = useDispatch()
  const isValidForSigning = useSelector(getIsValidForSigning)
  const isValidating = useSelector(getIsValidating)
  const isSigning = useSelector(getSigningStatus) !== CertificateSignStatus.INITIAL
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const disabled = isValidating || isSigning || !enabled || functionDisabled

  const handleConfirm = (showConfirmation: boolean) => () => {
    if (showConfirmation) {
      setConfirmModalOpen(true)
    } else {
      dispatch(startSignCertificate())
    }
  }

  return (
    <>
      <ConfirmModal
        modalTitle={name}
        startIcon={<img src={edit} alt={name} />}
        onConfirm={handleConfirm(false)}
        disabled={disabled}
        confirmButtonText={name}
        open={confirmModalOpen}
        setOpen={setConfirmModalOpen}>
        <div>
          <p>{body}</p>
        </div>
      </ConfirmModal>
      <CustomButton
        tooltip={description}
        buttonStyle={'primary'}
        disabled={confirmModalOpen || disabled}
        startIcon={<img src={edit} alt={name} />}
        onClick={handleConfirm(isValidForSigning && type === ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION)}
        text={name}
      />
    </>
  )
}

export default SignAndSendButton
