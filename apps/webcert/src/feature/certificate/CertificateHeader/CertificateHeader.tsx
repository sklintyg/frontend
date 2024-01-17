import { useSelector } from 'react-redux'
import styled from 'styled-components'
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
import CandidateWithMessageModal from '../Modals/CreateCertificateFromCandidateWithMessageModal'
import CertificateInfo from './CertificateInfo'
import HeaderButtons from './HeaderButtons'
import ShowHistory from './ShowHistory'

import { isEqual } from 'lodash-es'
import { Divider } from '../../../components/utils/Divider'
import { getQuestions } from '../../../store/question/questionSelectors'
import { ResourceLinkType } from '../../../types'
import { resourceLinksAreEqual } from '../../../utils'
import { SignCertificateModal } from '../Modals/SignCertificateModal'
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

const CertificateHeader: React.FC = () => {
  const certificateMetadata = useSelector(getCertificateMetaData, isEqual)
  const historyEntries = useSelector(getCertificateEvents, isEqual)
  const isShowSpinner = useSelector(getIsShowSpinner)
  const resourceLinks = useSelector(getResourceLinks, isEqual)
  const candidateResourceLink = resourceLinks.find((link) =>
    resourceLinksAreEqual(link.type, ResourceLinkType.CREATE_CERTIFICATE_FROM_CANDIDATE)
  )
  const candidateWithMessageResourceLink = resourceLinks.find((link) =>
    resourceLinksAreEqual(link.type, ResourceLinkType.CREATE_CERTIFICATE_FROM_CANDIDATE_WITH_MESSAGE)
  )
  const questions = useSelector(getQuestions, isEqual)
  const isValidForSigning = useSelector(getIsValidForSigning)
  const isValidating = useSelector(getIsValidating)
  const functionDisabled = useSelector(isCertificateFunctionDisabled)

  if (!certificateMetadata || isShowSpinner || !resourceLinks) {
    return null
  }

  return (
    <Wrapper>
      <div className="ic-container">
        <CreateCertificateFromCandidateModal resourceLink={candidateResourceLink} />
        <CandidateWithMessageModal resourceLink={candidateWithMessageResourceLink} />
        <SignCertificateModal />
        <StatusWrapper>
          <StatusLeftSide>
            <NavigateBackButton />
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
