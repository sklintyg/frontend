import { isEqual } from 'lodash-es'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import InfoBox from '../../../components/utils/InfoBox'
import StatusWithIcon from '../../../components/utils/StatusWithIcon'
import {
  getCertificateMetaData,
  getIsValidForSigning,
  getResourceLinks,
  getSigningStatus,
  isCertificateFunctionDisabled,
} from '../../../store/certificate/certificateSelectors'
import { CertificateSignStatus, ResourceLinkType } from '../../../types'
import { getResourceLink, resourceLinksAreEqual } from '../../../utils'
import ForwardCertificateButton from '../Buttons/ForwardCertificateButton'
import ReadyForSignButton from '../Buttons/ReadyForSignButton'
import SignAndSendButton from '../Buttons/SignAndSendButton'
import ShowValidationErrorsSwitch from './ShowValidationErrorsSwitch'

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 16px 0;
  justify-content: space-between;
  gap: 8px;
`

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: flex-end;
`

export const CertificateFooter: React.FC = () => {
  const certificateMetadata = useSelector(getCertificateMetaData, isEqual)
  const resourceLinks = useSelector(getResourceLinks, isEqual)
  const isValidForSigning = useSelector(getIsValidForSigning)
  const functionDisabled = useSelector(isCertificateFunctionDisabled)
  const isSigned = useSelector(getSigningStatus) === CertificateSignStatus.SIGNED
  if (!certificateMetadata || !resourceLinks) return null

  const canSign = resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.SIGN_CERTIFICATE))
  const canSignConfirm = resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION))
  const canForward = resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.FORWARD_CERTIFICATE))
  const canReadyForSign = resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.READY_FOR_SIGN))
  const isReadyForSign = certificateMetadata.readyForSign !== undefined

  return (
    <Wrapper>
      {!isSigned && (canSign || canSignConfirm) && (
        <div className={'iu-flex'}>
          <SignAndSendButton
            functionDisabled={functionDisabled}
            canSign={canSign}
            {...(canSignConfirm
              ? getResourceLink(resourceLinks, ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION)
              : getResourceLink(resourceLinks, ResourceLinkType.SIGN_CERTIFICATE))}
          />
        </div>
      )}

      {canForward && (
        <div className={'iu-flex'}>
          <ForwardCertificateButton
            certificateId={certificateMetadata.id}
            certificateType={certificateMetadata.type}
            unitName={certificateMetadata.unit.unitName}
            careProviderName={certificateMetadata.careProvider.unitName}
            forwarded={certificateMetadata.forwarded}
            functionDisabled={functionDisabled}
            {...getResourceLink(resourceLinks, ResourceLinkType.FORWARD_CERTIFICATE)}
          />
          {certificateMetadata.forwarded && (
            <StatusWithIcon icon="CheckIcon" additionalWrapperStyles={'iu-ml-400'}>
              Vidarebefordrat
            </StatusWithIcon>
          )}
        </div>
      )}

      {!isSigned && canReadyForSign && !isReadyForSign && (
        <div className={'iu-flex'}>
          <ReadyForSignButton
            functionDisabled={functionDisabled}
            isValidForSigning={isValidForSigning}
            {...getResourceLink(resourceLinks, ResourceLinkType.READY_FOR_SIGN)}
          />
        </div>
      )}

      {!isSigned && canReadyForSign && isReadyForSign && (
        <InfoBox type={'success'}>
          <p>Utkastet är sparat och markerat klart för signering.</p>
        </InfoBox>
      )}

      <RightWrapper>
        {(canForward || (canReadyForSign && !isReadyForSign)) && !isValidForSigning && <ShowValidationErrorsSwitch />}
        <p className={'iu-fs-200'}>Intygs-ID: {certificateMetadata.id}</p>
      </RightWrapper>
    </Wrapper>
  )
}
