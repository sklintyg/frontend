import * as React from 'react'
import { useSelector } from 'react-redux'
import { getResourceLink, InfoBox, resourceLinksAreEqual, ResourceLinkType, StatusWithIcon } from '@frontend/common'
import {
  getCertificateMetaData,
  getIsValidForSigning,
  getResourceLinks,
  isCertificateFunctionDisabled,
} from '../../../store/certificate/certificateSelectors'
import SignAndSendButton from '../Buttons/SignAndSendButton'
import ForwardCertificateButton from '../Buttons/ForwardCertificateButton'
import ShowValidationErrorsSwitch from './ShowValidationErrorsSwitch'
import styled from 'styled-components/macro'
import _ from 'lodash'
import ReadyForSignButton from '../Buttons/ReadyForSignButton'

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
  const certificateMetadata = useSelector(getCertificateMetaData, _.isEqual)
  const resourceLinks = useSelector(getResourceLinks, _.isEqual)
  const isValidForSigning = useSelector(getIsValidForSigning)
  const functionDisabled = useSelector(isCertificateFunctionDisabled)

  if (!certificateMetadata || !resourceLinks) return null

  const canSign = resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.SIGN_CERTIFICATE))
  const canForward = resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.FORWARD_CERTIFICATE))
  const canReadyForSign = resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.READY_FOR_SIGN))
  const isReadyForSign = certificateMetadata.readyForSign !== undefined

  return (
    <Wrapper>
      {canSign && (
        <div className={'iu-flex'}>
          <SignAndSendButton
            functionDisabled={functionDisabled}
            {...{ ...getResourceLink(resourceLinks, ResourceLinkType.SIGN_CERTIFICATE) }}
          />
        </div>
      )}

      {canForward && (
        <div className={'iu-flex'}>
          <ForwardCertificateButton
            certificateId={certificateMetadata.id}
            unitName={certificateMetadata.unit.unitName}
            careProviderName={certificateMetadata.careProvider.unitName}
            forwarded={certificateMetadata.forwarded}
            version={certificateMetadata.version}
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

      {canReadyForSign && !isReadyForSign && (
        <div className={'iu-flex'}>
          <ReadyForSignButton
            functionDisabled={functionDisabled}
            isValidForSigning={isValidForSigning}
            {...getResourceLink(resourceLinks, ResourceLinkType.READY_FOR_SIGN)}
          />
        </div>
      )}

      {canReadyForSign && isReadyForSign && (
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
