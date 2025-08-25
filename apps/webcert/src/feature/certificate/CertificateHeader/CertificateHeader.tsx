import { isEqual } from 'lodash-es'
import styled from 'styled-components'
import { Divider } from '../../../components/utils/Divider'
import {
  getCertificateEvents,
  getCertificateMetaData,
  getCertificateResourceLink,
  getCertificateResourceLinks,
  getIsShowSpinner,
  getIsValidating,
  getIsValidForSigning,
  isCertificateFunctionDisabled,
} from '../../../store/certificate/certificateSelectors'
import { getQuestions } from '../../../store/question/questionSelectors'
import { useAppSelector } from '../../../store/store'
import { ResourceLinkType } from '../../../types'
import CreateCertificateFromCandidateModal from '../Modals/CreateCertificateFromCandidateModal'
import CandidateWithMessageModal from '../Modals/CreateCertificateFromCandidateWithMessageModal'
import { SignCertificateModal } from '../Modals/SignCertificateModal'
import CertificateInfo from './CertificateInfo'
import { HeaderButtons } from './HeaderButtons'
import NavigateBackButton from './NavigateBackButton'
import ShowHistory from './ShowHistory'
import CertificateHeaderStatuses from './Status/CertificateHeaderStatuses'
import { SignCertificateErrorModal } from '../Modals/SignCertificateErrorModal'

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

export function CertificateHeader() {
  const certificateMetadata = useAppSelector(getCertificateMetaData, isEqual)
  const historyEntries = useAppSelector(getCertificateEvents, isEqual)
  const isShowSpinner = useAppSelector(getIsShowSpinner)
  const resourceLinks = useAppSelector(getCertificateResourceLinks, isEqual)
  const candidateResourceLink = useAppSelector(getCertificateResourceLink(ResourceLinkType.CREATE_CERTIFICATE_FROM_CANDIDATE))
  const candidateWithMessageResourceLink = useAppSelector(
    getCertificateResourceLink(ResourceLinkType.CREATE_CERTIFICATE_FROM_CANDIDATE_WITH_MESSAGE)
  )
  const questions = useAppSelector(getQuestions, isEqual)
  const isValidForSigning = useAppSelector(getIsValidForSigning)
  const isValidating = useAppSelector(getIsValidating)
  const functionDisabled = useAppSelector(isCertificateFunctionDisabled)

  if (!certificateMetadata || isShowSpinner) {
    return null
  }

  return (
    <Wrapper>
      <div className="ic-container">
        <CreateCertificateFromCandidateModal resourceLink={candidateResourceLink} />
        <CandidateWithMessageModal resourceLink={candidateWithMessageResourceLink} />
        <SignCertificateModal />
        <SignCertificateErrorModal />
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
