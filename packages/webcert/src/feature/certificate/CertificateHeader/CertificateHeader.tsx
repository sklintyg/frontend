import { Divider, ResourceLinkType } from '@frontend/common'
import * as React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import {
  getCertificateEvents,
  getCertificateMetaData,
  getIsShowSpinner,
  getIsValidating,
  getIsValidForSigning,
  getResourceLinks,
  isCertificateFunctionDisabled,
} from '../../../store/certificate/certificateSelectors'
import CreateCertificateFromCandidateModal from '../Modals/CreateCertificateFromCandidateModal'
import CertificateInfo from './CertificateInfo'
import HeaderButtons from './HeaderButtons'
import ShowHistory from './ShowHistory'

import _ from 'lodash'
import { useGetQuestionsQuery } from '../../../store/api'
import NavigateBackButton from './NavigateBackButton'
import CertificateHeaderStatuses from './Status/CertificateHeaderStatuses'

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

interface Props {
  certificateId: string
}

const CertificateHeader: React.FC<Props> = ({ certificateId }) => {
  const certificateMetadata = useSelector(getCertificateMetaData, _.isEqual)
  const historyEntries = useSelector(getCertificateEvents, _.isEqual)
  const isShowSpinner = useSelector(getIsShowSpinner)
  const resourceLinks = useSelector(getResourceLinks, _.isEqual)
  const candidateResourceLink = resourceLinks.find((link) => link.type === ResourceLinkType.CREATE_CERTIFICATE_FROM_CANDIDATE)
  const { data: questions } = useGetQuestionsQuery(certificateId)
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
        <StatusWrapper>
          <StatusLeftSide>
            <NavigateBackButton />
            <CertificateHeaderStatuses
              certificateMetadata={certificateMetadata}
              questions={questions || []}
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
