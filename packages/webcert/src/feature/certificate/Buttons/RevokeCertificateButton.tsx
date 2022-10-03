import { ButtonWithConfirmModal, CertificateStatus } from '@frontend/common'
import trash from '@frontend/common/src/images/trash.svg'
import _ from 'lodash'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { revokeCertificate, RevokeCertificateReason } from '../../../store/certificate/certificateActions'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'
import { RevokeCertificateModalContent } from './RevokeCertificateModalContent'

interface Props extends FunctionDisabled {
  name: string
  description: string
  enabled: boolean
}

const RevokeCertificateButton: React.FC<Props> = ({ name, description, enabled, functionDisabled }) => {
  const [dispatchObject, setDispatchObject] = useState<null | RevokeCertificateReason>(null)
  const dispatch = useDispatch()
  const [confirmButtonDisabled, setConfirmButtonDisabled] = useState(true)
  const metadata = useSelector(getCertificateMetaData, _.isEqual)

  const handleRevokeForm = (obj: RevokeCertificateReason) => {
    setDispatchObject(obj)
    const disabledConfirmButton = handleDisabled(obj)

    setConfirmButtonDisabled(disabledConfirmButton)
  }

  const handleDispatch = () => {
    if (dispatchObject) {
      dispatch(revokeCertificate(dispatchObject))
    }
  }

  const handleDisabled = (dispatchObject: RevokeCertificateReason): boolean => {
    if (dispatchObject.message.length > 0 && dispatchObject.reason === 'ANNAT_ALLVARLIGT_FEL') {
      return false
    } else if (dispatchObject.reason === 'FEL_PATIENT') {
      return false
    }
    return true
  }

  return (
    <ButtonWithConfirmModal
      onClose={() => setConfirmButtonDisabled(true)}
      confirmButtonDisabled={confirmButtonDisabled || functionDisabled}
      buttonStyle="secondary"
      name={name}
      disabled={!enabled}
      description={description}
      startIcon={<img src={trash} alt="Makulera" />}
      modalTitle={metadata?.status === CertificateStatus.LOCKED ? 'Makulera låst utkast' : 'Makulera intyg'}
      onConfirm={handleDispatch}
      confirmButtonText="Makulera">
      {metadata && <RevokeCertificateModalContent certificateId={metadata.id} onChange={handleRevokeForm} type={metadata.type} />}
    </ButtonWithConfirmModal>
  )
}

export default RevokeCertificateButton
