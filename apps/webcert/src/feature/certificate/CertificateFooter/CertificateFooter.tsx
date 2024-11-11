import { isEqual } from 'lodash-es'
import styled from 'styled-components'
import InfoBox from '../../../components/utils/InfoBox'
import StatusWithIcon from '../../../components/utils/StatusWithIcon'
import { WithCertificateResourceLink } from '../../../components/utils/WithResourceLink'
import {
  getCertificateMetaData,
  getCertificateResourceLink,
  getCertificateResourceLinks,
  getIsValidForSigning,
  getSigningStatus,
  isCertificateFunctionDisabled,
} from '../../../store/certificate/certificateSelectors'
import { useAppSelector } from '../../../store/store'
import { CertificateSignStatus, ResourceLinkType } from '../../../types'
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
  const resourceLinks = useAppSelector(getCertificateResourceLinks, isEqual)
  const isValidForSigning = useAppSelector(getIsValidForSigning)
  const functionDisabled = useAppSelector(isCertificateFunctionDisabled)
  const isSigned = useAppSelector((state) => getSigningStatus(state) === CertificateSignStatus.SIGNED)
  const signLink = useAppSelector(getCertificateResourceLink(ResourceLinkType.SIGN_CERTIFICATE))
  const forwardLink = useAppSelector(getCertificateResourceLink(ResourceLinkType.FORWARD_CERTIFICATE))
  const readyForSignLink = useAppSelector(getCertificateResourceLink(ResourceLinkType.READY_FOR_SIGN))
  const signConfirmationLink = useAppSelector(getCertificateResourceLink(ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION))
  const signAndSendLink = [signConfirmationLink, signLink].filter(Boolean)[0]

  if (!certificateMetadata || !resourceLinks) return null
  const isReadyForSign = certificateMetadata.readyForSign !== undefined

  return (
    <Wrapper>
      {!isSigned && signAndSendLink && (
        <div className="iu-flex">
          <SignAndSendButton
            functionDisabled={functionDisabled}
            canSign={Boolean(signLink)}
            {...signAndSendLink}
            signConfirmationModal={certificateMetadata.signConfirmationModal}
          />
        </div>
      )}

      <WithCertificateResourceLink type={ResourceLinkType.FORWARD_CERTIFICATE}>
        {(link) => (
          <div className="iu-flex">
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
              <StatusWithIcon icon="CheckIcon" additionalWrapperStyles="iu-ml-400">
                Vidarebefordrat
              </StatusWithIcon>
            )}
          </div>
        )}
      </WithCertificateResourceLink>

      {!isSigned && !isReadyForSign && (
        <WithCertificateResourceLink type={ResourceLinkType.READY_FOR_SIGN}>
          {(link) => (
            <div className="iu-flex">
              <ReadyForSignButton functionDisabled={functionDisabled} isValidForSigning={isValidForSigning} {...link} />
            </div>
          )}
        </WithCertificateResourceLink>
      )}

      {!isSigned && isReadyForSign && (
        <WithCertificateResourceLink type={ResourceLinkType.READY_FOR_SIGN}>
          {() => (
            <InfoBox type="success">
              <p>Utkastet är sparat och markerat klart för signering.</p>
            </InfoBox>
          )}
        </WithCertificateResourceLink>
      )}

      <RightWrapper>
        {(forwardLink || (readyForSignLink && !isReadyForSign)) && !isValidForSigning && <ShowValidationErrorsSwitch />}
        <p className="iu-fs-200">Intygs-ID: {certificateMetadata.id}</p>
      </RightWrapper>
    </Wrapper>
  )
}
