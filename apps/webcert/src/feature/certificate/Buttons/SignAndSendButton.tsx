import { useState } from 'react'
import { useSelector } from 'react-redux'
import type { Merge } from 'type-fest'
import { CustomButton } from '../../../components/Inputs/CustomButton'
import { ConfirmModal } from '../../../components/utils/Modal/ConfirmModal'
import { editImage } from '../../../images'
import { startSignCertificate } from '../../../store/certificate/certificateActions'
import { getIsValidating, getIsValidForSigning, getSigningStatus } from '../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../store/store'
import type { ResourceLink } from '../../../types'
import { CertificateSignStatus, ResourceLinkType } from '../../../types'
import type { CertificateConfirmationModal } from '../../../types/confirmModal'
import type { FunctionDisabled } from '../../../utils/functionDisablerUtils'
import { ConfirmationModal } from '../Modals/ConfirmationModal'

interface Props extends Merge<FunctionDisabled, ResourceLink> {
  canSign: boolean
  signConfirmationModal?: CertificateConfirmationModal | null
}

const SignAndSendButton = ({ name, canSign, title, description, enabled, body, type, functionDisabled, signConfirmationModal }: Props) => {
  const dispatch = useAppDispatch()
  const isValidForSigning = useSelector(getIsValidForSigning)
  const isValidating = useSelector(getIsValidating)
  const signingStatus = useSelector(getSigningStatus)
  const isSigning = signingStatus === CertificateSignStatus.PROCESSING || signingStatus === CertificateSignStatus.WAIT_FOR_SIGN
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)
  const disabled = isValidating || isSigning || !enabled || functionDisabled
  const showMetaConfirmationModal = canSign && signConfirmationModal

  return (
    <>
      {signConfirmationModal && (
        <ConfirmationModal open={confirmationModalOpen} setOpen={setConfirmationModalOpen} {...signConfirmationModal} />
      )}
      <ConfirmModal
        modalTitle={title ?? name}
        startIcon={<img src={editImage} alt={name} />}
        onConfirm={() => (showMetaConfirmationModal ? setConfirmationModalOpen(true) : dispatch(startSignCertificate()))}
        disabled={disabled}
        confirmButtonText={showMetaConfirmationModal ? 'Fortsätt signering' : name}
        open={confirmModalOpen}
        hideConfirmButton={!canSign}
        setOpen={setConfirmModalOpen}
        declineButtonText={canSign ? 'Avbryt' : 'Stäng'}
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
        onClick={() => {
          if (isValidForSigning && (type === ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION || Boolean(signConfirmationModal))) {
            if (type === ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION) {
              setConfirmModalOpen(true)
            } else if (showMetaConfirmationModal) {
              setConfirmationModalOpen(true)
            }
          } else {
            dispatch(startSignCertificate())
          }
        }}
        text={name}
      />
    </>
  )
}

export default SignAndSendButton
