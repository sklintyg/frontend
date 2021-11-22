import * as React from 'react'
import { useSelector } from 'react-redux'
import {
  getCertificateEvents,
  getCertificateMetaData,
  getIsLocked,
  getIsShowSpinner,
  getIsValidating,
  getIsValidForSigning,
  getResourceLinks,
} from '../../../store/certificate/certificateSelectors'
import AvailableForPatientStatus from './Status/AvailableForPatientStatus'
import RevokedStatus from './Status/RevokedStatus'
import DraftSavedStatus from './Status/DraftSavedStatus'
import SignableStatus from './Status/SignableStatus'
import SentStatus from './Status/SentStatus'
import ReplacedStatus from './Status/ReplacedStatus'
import ShowHistory from './ShowHistory'
import CertificateInfo from './CertificateInfo'
import RevokeParentStatus from './Status/RevokeParentStatus'
import HeaderButtons from './HeaderButtons'
import LockedStatus from './Status/LockedStatus'
import styled from 'styled-components/macro'
import { Divider } from '@frontend/common'
import CreateCertificateFromCandidateModal from '../Modals/CreateCertificateFromCandidateModal'
import { resourceLinksAreEqual, ResourceLinkType } from '@frontend/common/src'
import { getQuestions } from '../../../store/question/questionSelectors'
import ComplementStatus from './Status/ComplementStatus'
import _ from 'lodash'
import HasBeenComplementedStatus from './Status/HasBeenComplementedStatus'

const Wrapper = styled.div`
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12);
  border-bottom: 1px solid #d7d7dd;
`

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 0;
`

const StatusLeftSide = styled.div`
  display: flex;
  flex-grow: 1;

  .status + .status {
    margin-left: 16px;
  }
`

const CertificateHeader = () => {
  const certificateMetadata = useSelector(getCertificateMetaData, _.isEqual)
  const historyEntries = useSelector(getCertificateEvents, _.isEqual)
  const isValidForSigning = useSelector(getIsValidForSigning)
  const isValidating = useSelector(getIsValidating)
  const isShowSpinner = useSelector(getIsShowSpinner)
  const resourceLinks = useSelector(getResourceLinks, _.isEqual)
  const isLocked = useSelector(getIsLocked)
  const questions = useSelector(getQuestions, _.isEqual)
  const candidateResourceLink = resourceLinks.find((link) =>
    resourceLinksAreEqual(link.type, ResourceLinkType.CREATE_CERTIFICATE_FROM_CANDIDATE)
  )

  if (!certificateMetadata || isShowSpinner || !resourceLinks) {
    return null
  }

  return (
    <Wrapper>
      <div className="ic-container iu-pt-200">
        <CreateCertificateFromCandidateModal resourceLink={candidateResourceLink}></CreateCertificateFromCandidateModal>
        <StatusWrapper>
          <StatusLeftSide>
            <RevokedStatus certificateMetadata={certificateMetadata} />
            <SignableStatus certificateMetadata={certificateMetadata} isValidForSigning={isValidForSigning} />
            <DraftSavedStatus certificateMetadata={certificateMetadata} isValidating={isValidating} isEditable={!isLocked} />
            <ComplementStatus certificateMetadata={certificateMetadata} questions={questions} />
            <SentStatus certificateMetadata={certificateMetadata} questions={questions} historyEntries={historyEntries} />
            <HasBeenComplementedStatus historyEntries={historyEntries} />
            <ReplacedStatus certificateMetadata={certificateMetadata} />
            <AvailableForPatientStatus certificateMetadata={certificateMetadata} />
            <RevokeParentStatus certificateMetadata={certificateMetadata} />
            <LockedStatus certificateMetadata={certificateMetadata} />
          </StatusLeftSide>
          <ShowHistory historyEntries={historyEntries} certificateMetadata={certificateMetadata} />
        </StatusWrapper>
        <Divider />
        <div className="iu-flex">
          <CertificateInfo certificateMetadata={certificateMetadata} />
          <HeaderButtons resourceLinks={resourceLinks} certificateMetadata={certificateMetadata} />
        </div>
      </div>
    </Wrapper>
  )
}

export default CertificateHeader
