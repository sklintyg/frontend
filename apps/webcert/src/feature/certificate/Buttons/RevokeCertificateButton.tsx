import { ButtonWithConfirmModal, CertificateStatus, trashImage } from '@frontend/common'
import _ from 'lodash'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { revokeCertificate, RevokeCertificateReason } from '../../../store/certificate/certificateActions'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'
import { RevokeCertificateModalContent } from './RevokeCertificateModalContent'
import { RevokeDBAndDOIModalContent } from './RevokeDBAndDOIModalContent'

interface Props extends FunctionDisabled {
  name: string
  description: string
  enabled: boolean
}

const RevokeCertificateButton: React.FC<Props> = ({ name, description, enabled, functionDisabled }) => {
  const [dispatchObject, setDispatchObject] = useState<null | RevokeCertificateReason>(null)
  const dispatch = useDispatch()
  const metadata = useSelector(getCertificateMetaData, _.isEqual)
  const isDodsbevis = metadata?.type === 'db'
  const isDodsorsaksIntyg = metadata?.type === 'doi'
  const [confirmButtonDisabled, setConfirmButtonDisabled] = useState(isDodsbevis || isDodsorsaksIntyg ? false : true)

  const handleRevokeForm = (obj: RevokeCertificateReason) => {
    setDispatchObject(obj)
    const disabledConfirmButton = handleDisabled(obj)

    setConfirmButtonDisabled(disabledConfirmButton)
  }

  const handleDispatch = () => {
    if (dispatchObject) {
      dispatch(revokeCertificate(dispatchObject))
    } else {
      dispatch(revokeCertificate({ reason: '', message: '', title: '' }))
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
      onClose={() => (isDodsbevis || isDodsorsaksIntyg ? setConfirmButtonDisabled(false) : setConfirmButtonDisabled(true))}
      confirmButtonDisabled={confirmButtonDisabled || functionDisabled}
      buttonStyle="secondary"
      name={name}
      disabled={!enabled}
      description={description}
      startIcon={<img src={trashImage} alt="Makulera" />}
      modalTitle={metadata?.status === CertificateStatus.LOCKED ? 'Makulera låst utkast' : 'Makulera intyg'}
      onConfirm={handleDispatch}
      confirmButtonText="Makulera"
      buttonTestId="revoke-certificate-button">
      {isDodsbevis || isDodsorsaksIntyg ? (
        <RevokeDBAndDOIModalContent />
      ) : (
        <RevokeCertificateModalContent onChange={handleRevokeForm} type={metadata?.type} />
      )}
    </ButtonWithConfirmModal>
  )
}

export default RevokeCertificateButton
