import { isEqual } from 'lodash-es'
import styled from 'styled-components'
import InfoBox from '../../../components/utils/InfoBox'
import StatusWithIcon from '../../../components/utils/StatusWithIcon'
import { WithResourceLink } from '../../../components/utils/WithResourceLink'
import {
  getCertificateMetaData,
  getIsValidForSigning,
  getResourceLinks,
  getSigningStatus,
  isCertificateFunctionDisabled,
} from '../../../store/certificate/certificateSelectors'
import { useAppSelector } from '../../../store/store'
import { CertificateSignStatus, ResourceLinkType } from '../../../types'
import { resourceLinksAreEqual } from '../../../utils'
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

export function CertificateFooter() {
  const certificateMetadata = useAppSelector(getCertificateMetaData, isEqual)
  const resourceLinks = useAppSelector(getResourceLinks, isEqual)
  const isValidForSigning = useAppSelector(getIsValidForSigning)
  const functionDisabled = useAppSelector(isCertificateFunctionDisabled)
  const isSigned = useAppSelector(getSigningStatus) === CertificateSignStatus.SIGNED
  if (!certificateMetadata || !resourceLinks) return null

  const canSign = resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.SIGN_CERTIFICATE))
  const canForward = resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.FORWARD_CERTIFICATE))
  const canReadyForSign = resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.READY_FOR_SIGN))
  const isReadyForSign = certificateMetadata.readyForSign !== undefined

  return (
    <Wrapper>
      {!isSigned &&
        [ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION, ResourceLinkType.SIGN_CERTIFICATE].map((type) => (
          <WithResourceLink type={type} key={type}>
            {(link) => (
              <div className={'iu-flex'}>
                <SignAndSendButton functionDisabled={functionDisabled} canSign={canSign} {...link} />
              </div>
            )}
          </WithResourceLink>
        ))}

      <WithResourceLink type={ResourceLinkType.FORWARD_CERTIFICATE}>
        {(link) => (
          <div className={'iu-flex'}>
            <ForwardCertificateButton
              certificateId={certificateMetadata.id}
              certificateType={certificateMetadata.type}
              unitName={certificateMetadata.unit.unitName}
              careProviderName={certificateMetadata.careProvider.unitName}
              forwarded={certificateMetadata.forwarded}
              functionDisabled={functionDisabled}
              {...link}
            />
            {certificateMetadata.forwarded && (
              <StatusWithIcon icon="CheckIcon" additionalWrapperStyles={'iu-ml-400'}>
                Vidarebefordrat
              </StatusWithIcon>
            )}
          </div>
        )}
      </WithResourceLink>

      {!isSigned && !isReadyForSign && (
        <WithResourceLink type={ResourceLinkType.READY_FOR_SIGN}>
          {(link) => (
            <div className={'iu-flex'}>
              <ReadyForSignButton functionDisabled={functionDisabled} isValidForSigning={isValidForSigning} {...link} />
            </div>
          )}
        </WithResourceLink>
      )}

      {!isSigned && isReadyForSign && (
        <WithResourceLink type={ResourceLinkType.READY_FOR_SIGN}>
          {() => (
            <InfoBox type="success">
              <p>Utkastet är sparat och markerat klart för signering.</p>
            </InfoBox>
          )}
        </WithResourceLink>
      )}

      <RightWrapper>
        {(canForward || (canReadyForSign && !isReadyForSign)) && !isValidForSigning && <ShowValidationErrorsSwitch />}
        <p className={'iu-fs-200'}>Intygs-ID: {certificateMetadata.id}</p>
      </RightWrapper>
    </Wrapper>
  )
}
