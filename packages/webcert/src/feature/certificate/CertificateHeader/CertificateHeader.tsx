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
  const certificateMetadata = useSelector(getCertificateMetaData)
  const historyEntries = useSelector(getCertificateEvents)
  const isValidForSigning = useSelector(getIsValidForSigning)
  const isValidating = useSelector(getIsValidating)
  const isShowSpinner = useSelector(getIsShowSpinner)
  const resourceLinks = useSelector(getResourceLinks)
  const isLocked = useSelector(getIsLocked)

  if (!certificateMetadata || isShowSpinner || !resourceLinks) {
    return null
  }

  return (
    <Wrapper>
      <div className="ic-container iu-pt-200">
        <CreateCertificateFromCandidateModal resourceLinks={resourceLinks}></CreateCertificateFromCandidateModal>
        <StatusWrapper>
          <StatusLeftSide>
            <RevokedStatus certificateMetadata={certificateMetadata} />
            <SignableStatus certificateMetadata={certificateMetadata} isValidForSigning={isValidForSigning} />
            <DraftSavedStatus certificateMetadata={certificateMetadata} isValidating={isValidating} isEditable={!isLocked} />
            <SentStatus certificateMetadata={certificateMetadata} />
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
