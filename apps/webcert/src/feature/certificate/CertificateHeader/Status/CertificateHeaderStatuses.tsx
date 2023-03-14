import {
  CertificateMetadata,
  StatusWithIcon,
  getComplementedByCertificateRelation,
  hasUnhandledComplementQuestions,
  isDraft,
  isLocked,
  isReplacedByActiveChild,
  isRevoked,
  isSigned,
  Question,
} from '@frontend/common'
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

interface Props {
  certificateMetadata: CertificateMetadata
  questions: Question[]
  isValidForSigning?: boolean
  isValidating?: boolean
}

const CertificateHeaderStatuses: React.FC<Props> = ({ certificateMetadata, questions, isValidForSigning, isValidating }) => {
  const isCertificateLocked = isLocked(certificateMetadata)

  const getStatusInFirstPosition = () => {
    const complementedRelation = getComplementedByCertificateRelation(certificateMetadata)

    if (isCertificateLocked) {
      return <LockedStatus certificateMetadata={certificateMetadata} />
    } else if (isRevoked(certificateMetadata)) {
      return <RevokedStatus certificateMetadata={certificateMetadata} />
    } else if (isSigned(certificateMetadata)) {
      if (isReplacedByActiveChild(certificateMetadata)) {
        return <ReplacedStatus certificateMetadata={certificateMetadata} />
      }
      if (complementedRelation) {
        return <HasBeenComplementedStatus relation={complementedRelation} />
      }
      if (hasUnhandledComplementQuestions(questions)) {
        return <ComplementStatus />
      }
      if (certificateMetadata.sent) {
        return <SentStatus certificateMetadata={certificateMetadata} />
      }
      return <StatusWithIcon icon={'CheckIcon'}>Intyget är signerat</StatusWithIcon>
    } else {
      return <SignableStatus isValidForSigning={isValidForSigning ? isValidForSigning : false} />
    }
  }

  return (
    <>
      {getStatusInFirstPosition()}
      {!isCertificateLocked && isDraft(certificateMetadata) && (
        <DraftSavedStatus certificateMetadata={certificateMetadata} isValidating={isValidating ? isValidating : false} />
      )}
      <AvailableForPatientStatus certificateMetadata={certificateMetadata} />
    </>
  )
}

export default CertificateHeaderStatuses
