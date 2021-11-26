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
import LockedStatus from './LockedStatus'
import { useSelector } from 'react-redux'
import { getIsLocked, getIsValidating, getIsValidForSigning } from '../../../../store/certificate/certificateSelectors'
import {
  CertificateEvent,
  getComplementedByCertificateEvent,
  hasUnhandledComplementQuestions,
  isReplacedByActiveChild,
  isRevoked,
  isSigned,
  Question,
} from '@frontend/common/src'

interface Props {
  certificateMetadata: CertificateMetadata
  historyEntries: CertificateEvent[]
  questions: Question[]
  isValidForSigning?: boolean
}

const CertificateHeaderStatuses: React.FC<Props> = ({ certificateMetadata, historyEntries, questions, isValidForSigning }) => {
  const isValidating = useSelector(getIsValidating)
  const isLocked = useSelector(getIsLocked)

  const getStatusInFirstPosition = () => {
    const complementedEvent = getComplementedByCertificateEvent(historyEntries)
    if (isRevoked(certificateMetadata)) {
      return <RevokedStatus certificateMetadata={certificateMetadata} />
    }
    if (isSigned(certificateMetadata)) {
      if (isReplacedByActiveChild(certificateMetadata)) {
        return <ReplacedStatus certificateMetadata={certificateMetadata} />
      }
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
    } else if (isLocked) {
      return <LockedStatus certificateMetadata={certificateMetadata} />
    } else {
      return <SignableStatus isValidForSigning={isValidForSigning ? isValidForSigning : false} />
    }
  }

  return (
    <>
      {getStatusInFirstPosition()}
      <DraftSavedStatus certificateMetadata={certificateMetadata} isValidating={isValidating} isEditable={!isLocked} />
      <AvailableForPatientStatus certificateMetadata={certificateMetadata} />
    </>
  )
}

export default CertificateHeaderStatuses
