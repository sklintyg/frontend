import { CertificateSignStatus, ButtonWithConfirmModal, resourceLinksAreEqual, ResourceLinkType, ResourceLink } from '@frontend/common'
import edit from '@frontend/common/src/images/edit.svg'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { startSignCertificate } from '../../../store/certificate/certificateActions'
import { getIsValidating, getSigningStatus } from '../../../store/certificate/certificateSelectors'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'

interface Props extends FunctionDisabled {
  link: ResourceLink
  canSign: boolean
}

const SignAndSendButton: React.FC<Props> = ({ link, canSign, functionDisabled }) => {
  const dispatch = useDispatch()
  const isValidating = useSelector(getIsValidating)
  const isSigning = useSelector(getSigningStatus) !== CertificateSignStatus.INITIAL

  return (
    <ButtonWithConfirmModal
      description={link.description}
      buttonStyle="primary"
      name={link.name}
      modalTitle={link.name}
      startIcon={<img src={edit} alt="Signera intyget" />}
      confirmButtonText={link.name}
      disabled={isValidating || isSigning || !link.enabled || functionDisabled}
      hideConfirmButton={canSign != true}
      onClick={() => {
        !resourceLinksAreEqual(link.type, ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION) && dispatch(startSignCertificate())
      }}
      onConfirm={() => {
        canSign && dispatch(startSignCertificate())
      }}>
      {link.body ? (
        <div>
          <p>{link.body}</p>
        </div>
      ) : (
        ''
      )}
    </ButtonWithConfirmModal>
  )
}

export default SignAndSendButton
