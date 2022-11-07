import { CertificateSignStatus, ConfirmModal, CustomButton, ResourceLinkType, ResourceLink } from '@frontend/common'
import edit from '@frontend/common/src/images/edit.svg'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { startSignCertificate } from '../../../store/certificate/certificateActions'
import { getIsValidating, getIsValidForSigning, getSigningStatus } from '../../../store/certificate/certificateSelectors'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'
import { Merge } from 'type-fest'

interface Props extends Merge<FunctionDisabled, ResourceLink> {
  canSign: boolean
}

const SignAndSendButton: React.FC<Props> = ({ name, canSign, description, enabled, body, type, functionDisabled }) => {
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
        hideConfirmButton={!canSign}
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
        data-testid="sign-certificate-button"
        onClick={handleConfirm(isValidForSigning && type === ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION)}
        text={name}
      />
    </>
  )
}

export default SignAndSendButton
