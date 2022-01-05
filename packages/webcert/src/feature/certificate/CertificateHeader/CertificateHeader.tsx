import * as React from 'react'
import { useSelector } from 'react-redux'
import {
  getCertificateEvents,
  getCertificateMetaData,
  getIsShowSpinner,
  getIsValidating,
  getIsValidForSigning,
  getResourceLinks,
  isCertificateFunctionDisabled,
} from '../../../store/certificate/certificateSelectors'
import ShowHistory from './ShowHistory'
import CertificateInfo from './CertificateInfo'
import HeaderButtons from './HeaderButtons'
import styled from 'styled-components/macro'
import { Divider } from '@frontend/common'
import CreateCertificateFromCandidateModal from '../Modals/CreateCertificateFromCandidateModal'
import { getResourceLink, resourceLinksAreEqual, ResourceLinkType } from '@frontend/common/src'
import { getQuestions } from '../../../store/question/questionSelectors'
import _ from 'lodash'
import CertificateHeaderStatuses from './Status/CertificateHeaderStatuses'
import ProtectedUserApprovalModal from '../Modals/ProtectedUserApprovalModal'

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

const CertificateHeader: React.FC = () => {
  const certificateMetadata = useSelector(getCertificateMetaData, _.isEqual)
  const historyEntries = useSelector(getCertificateEvents, _.isEqual)
  const isShowSpinner = useSelector(getIsShowSpinner)
  const resourceLinks = useSelector(getResourceLinks, _.isEqual)
  const candidateResourceLink = resourceLinks.find((link) =>
    resourceLinksAreEqual(link.type, ResourceLinkType.CREATE_CERTIFICATE_FROM_CANDIDATE)
  )
  const protectedUserApprovalResourceLink = getResourceLink(resourceLinks, ResourceLinkType.PROTECTED_USER_APPROVAL)
  const questions = useSelector(getQuestions, _.isEqual)
  const isValidForSigning = useSelector(getIsValidForSigning)
  const isValidating = useSelector(getIsValidating)
  const functionDisabled = useSelector(isCertificateFunctionDisabled)

  if (!certificateMetadata || isShowSpinner || !resourceLinks) {
    return null
  }

  return (
    <Wrapper>
      <div className="ic-container iu-pt-200">
        <CreateCertificateFromCandidateModal resourceLink={candidateResourceLink} />
        <ProtectedUserApprovalModal resourceLink={protectedUserApprovalResourceLink} />
        <StatusWrapper>
          <StatusLeftSide>
            <CertificateHeaderStatuses
              certificateMetadata={certificateMetadata}
              questions={questions}
              isValidForSigning={isValidForSigning}
              isValidating={isValidating}
            />
          </StatusLeftSide>
          <ShowHistory historyEntries={historyEntries} certificateMetadata={certificateMetadata} />
        </StatusWrapper>
        <Divider />
        <div className="iu-flex">
          <CertificateInfo certificateMetadata={certificateMetadata} />
          <HeaderButtons resourceLinks={resourceLinks} certificateMetadata={certificateMetadata} functionDisabled={functionDisabled} />
        </div>
      </div>
    </Wrapper>
  )
}

export default CertificateHeader
