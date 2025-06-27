import type React from 'react'
import StatusWithIcon from '../../../../components/utils/StatusWithIcon'
import type { CertificateMetadata, Question } from '../../../../types'
import {
  getComplementedByCertificateRelation,
  hasUnhandledComplementQuestions,
  isDraft,
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

const CertificateHeaderStatuses = ({ certificateMetadata, questions, isValidForSigning, isValidating }: Props) => {
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
