import { isDraft } from '@reduxjs/toolkit'
import React from 'react'
import StatusWithIcon from '../../../../components/utils/StatusWithIcon'
import { CertificateMetadata, Question } from '../../../../types'
import {
  getComplementedByCertificateRelation,
  hasUnhandledComplementQuestions,
  isLocked,
  isReplacedByActiveChild,
  isRevoked,
  isSigned,
} from '../../../../utils'
import AvailableForPatientStatus from './AvailableForPatientStatus'
import ComplementStatus from './ComplementStatus'
import DraftSavedStatus from './DraftSavedStatus'
import HasBeenComplementedStatus from './HasBeenComplementedStatus'
import LockedStatus from './LockedStatus'
import ReplacedStatus from './ReplacedStatus'
import RevokedStatus from './RevokedStatus'
import SentStatus from './SentStatus'
import SignableStatus from './SignableStatus'

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
