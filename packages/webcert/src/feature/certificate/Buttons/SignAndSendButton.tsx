import { CertificateSignStatus, ConfirmModal, CustomButton, ResourceLink, ResourceLinkType } from '@frontend/common'
import edit from '@frontend/common/src/images/edit.svg'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Merge } from 'type-fest'
import { startSignCertificate } from '../../../store/certificate/certificateActions'
import { getIsValidating, getIsValidForSigning, getSigningStatus } from '../../../store/certificate/certificateSelectors'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'
import { useAppDispatch } from '../../../store/store'

interface Props extends Merge<FunctionDisabled, ResourceLink> {
  canSign: boolean
}

const SignAndSendButton: React.FC<Props> = ({ name, canSign, title, description, enabled, body, type, functionDisabled }) => {
  const dispatch = useAppDispatch()
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
        modalTitle={title ?? name}
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
