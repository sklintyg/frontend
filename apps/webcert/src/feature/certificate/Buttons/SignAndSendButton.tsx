import type React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import type { Merge } from 'type-fest'
import { startSignCertificate } from '../../../store/certificate/certificateActions'
import { getIsValidating, getIsValidForSigning, getSigningStatus } from '../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../store/store'
import type { FunctionDisabled } from '../../../utils/functionDisablerUtils'
import { CustomButton } from '../../../components/Inputs/CustomButton'
import { ConfirmModal } from '../../../components/utils/Modal/ConfirmModal'
import { editImage } from '../../../images'
import type { ResourceLink } from '../../../types'
import { CertificateSignStatus, ResourceLinkType } from '../../../types'
import { ConfirmationModal } from '../Modals/ConfirmationModal'
import type { CertificateConfirmationModal } from '../../../types/confirmModal'

interface Props extends Merge<FunctionDisabled, ResourceLink> {
  canSign: boolean
  signConfirmationModal?: CertificateConfirmationModal | null
}

const SignAndSendButton: React.FC<Props> = ({
  name,
  canSign,
  title,
  description,
  enabled,
  body,
  type,
  functionDisabled,
  signConfirmationModal,
}) => {
  const dispatch = useAppDispatch()
  const isValidForSigning = useSelector(getIsValidForSigning)
  const isValidating = useSelector(getIsValidating)
  const signingStatus = useSelector(getSigningStatus)
  const isSigning = signingStatus === CertificateSignStatus.PROCESSING || signingStatus === CertificateSignStatus.WAIT_FOR_SIGN
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)
  const disabled = isValidating || isSigning || !enabled || functionDisabled

  const handleConfirm = (showConfirmation: boolean) => () => {
    if (showConfirmation) {
      if (type === ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION) {
        setConfirmModalOpen(true)
      }
      if (canSign && signConfirmationModal) {
        setConfirmationModalOpen(true)
      }
    } else if (isValidForSigning) {
      dispatch(startSignCertificate())
    }
  }

  return (
    <>
      {signConfirmationModal ? (
        <>
          <ConfirmationModal open={confirmationModalOpen} setOpen={setConfirmationModalOpen} {...signConfirmationModal} />
        </>
      ) : (
        <></>
      )}
      <ConfirmModal
        modalTitle={title ?? name}
        startIcon={<img src={editImage} alt={name} />}
        onConfirm={handleConfirm(false)}
        disabled={disabled}
        confirmButtonText={name}
        open={confirmModalOpen}
        hideConfirmButton={!canSign}
        setOpen={setConfirmModalOpen}
      >
        <div>
          <p>{body}</p>
        </div>
      </ConfirmModal>
      <CustomButton
        tooltip={description}
        buttonStyle={'primary'}
        disabled={confirmModalOpen || disabled}
        startIcon={<img src={editImage} alt={name} />}
        data-testid="sign-certificate-button"
        onClick={handleConfirm(isValidForSigning && (type === ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION || !!signConfirmationModal))}
        text={name}
      />
    </>
  )
}

export default SignAndSendButton
