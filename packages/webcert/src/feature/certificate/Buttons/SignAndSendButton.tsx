import { CertificateSignStatus, ButtonWithConfirmModal, CustomButton, ResourceLinkType } from '@frontend/common'
import edit from '@frontend/common/src/images/edit.svg'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { startSignCertificate } from '../../../store/certificate/certificateActions'
import { getIsValidating, getSigningStatus } from '../../../store/certificate/certificateSelectors'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'

interface Props extends FunctionDisabled {
  canSign: boolean
  name: string
  description: string
  enabled: boolean
  body?: string
  type: ResourceLinkType
}

const SignAndSendButton: React.FC<Props> = ({ name, description, enabled, body, type, canSign, functionDisabled }) => {
  const dispatch = useDispatch()
  const isValidating = useSelector(getIsValidating)
  const isSigning = useSelector(getSigningStatus) !== CertificateSignStatus.INITIAL
  let button = <></>

  const handleConfirm = () => {
    dispatch(startSignCertificate())
  }

  if (type === ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION)
    button = (
      <ButtonWithConfirmModal
        description={description}
        buttonStyle="primary"
        name={name}
        modalTitle={name}
        startIcon={<img src={edit} alt="Signera intyget" />}
        confirmButtonText={name}
        onConfirm={handleConfirm}
        disabled={isValidating || isSigning || !enabled || functionDisabled}
        hideConfirmButton={canSign === false}>
        {body ? (
          <div>
            <p>{body}</p>
          </div>
        ) : (
          <></>
        )}
      </ButtonWithConfirmModal>
    )
  else if (canSign)
    button = (
      <CustomButton
        tooltip={description}
        buttonStyle={'primary'}
        disabled={isValidating || isSigning || !enabled || functionDisabled}
        startIcon={<img src={edit} alt="Signera intyget" />}
        onClick={handleConfirm}
        text={name}
      />
    )

  return button
}

export default SignAndSendButton
