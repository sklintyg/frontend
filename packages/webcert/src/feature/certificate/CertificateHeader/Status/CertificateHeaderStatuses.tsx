import { CertificateMetadata, StatusWithIcon, TextWithInfoModal, isDisabled } from '@frontend/common'
import React from 'react'
import RevokedStatus from './RevokedStatus'
import SignableStatus from './SignableStatus'
import DraftSavedStatus from './DraftSavedStatus'
import ComplementStatus from './ComplementStatus'
import SentStatus from './SentStatus'
import HasBeenComplementedStatus from './HasBeenComplementedStatus'
import ReplacedStatus from './ReplacedStatus'
import AvailableForPatientStatus from './AvailableForPatientStatus'
import RevokeParentStatus from './RevokeParentStatus'
import LockedStatus from './LockedStatus'
import { useSelector } from 'react-redux'
import { getIsLocked, getIsValidating, getIsValidForSigning } from '../../../../store/certificate/certificateSelectors'
import { getQuestions } from '../../../../store/question/questionSelectors'
import _ from 'lodash'
import {
  CertificateEvent,
  getComplementedByCertificateEvent,
  hasUnhandledComplementQuestions,
  isReplaced,
  isRevoked,
  isSigned,
} from '@frontend/common/src'

interface Props {
  certificateMetadata: CertificateMetadata
  historyEntries: CertificateEvent[]
}

const CertificateHeaderStatuses: React.FC<Props> = ({ certificateMetadata, historyEntries }) => {
  const isValidForSigning = useSelector(getIsValidForSigning)
  const isValidating = useSelector(getIsValidating)
  const isLocked = useSelector(getIsLocked)
  const questions = useSelector(getQuestions, _.isEqual)

  const getStatusInFirstPosition = () => {
    const complementedEvent = getComplementedByCertificateEvent(historyEntries)
    if (isRevoked(certificateMetadata)) {
      return <RevokedStatus certificateMetadata={certificateMetadata} />
    }
    if (!isReplaced(certificateMetadata) && isSigned(certificateMetadata)) {
      if (complementedEvent) {
        return <HasBeenComplementedStatus certificateEvent={complementedEvent} />
      }
      if (hasUnhandledComplementQuestions(questions)) {
        return <ComplementStatus />
      }
      if (certificateMetadata.sent) {
        return <SentStatus certificateMetadata={certificateMetadata} />
      }
      return <StatusWithIcon icon={'CheckIcon'}>Intyget har signerats</StatusWithIcon>
    }
  }

  return (
    <>
      <SignableStatus certificateMetadata={certificateMetadata} isValidForSigning={isValidForSigning} />
      <DraftSavedStatus certificateMetadata={certificateMetadata} isValidating={isValidating} isEditable={!isLocked} />
      {getStatusInFirstPosition()}
      <ReplacedStatus certificateMetadata={certificateMetadata} />
      <AvailableForPatientStatus certificateMetadata={certificateMetadata} />
      <LockedStatus certificateMetadata={certificateMetadata} />
    </>
  )
}

export default CertificateHeaderStatuses
