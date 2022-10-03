import { getResourceLink, InfoBox, ResourceLinkType, StatusWithIcon } from '@frontend/common'
import _ from 'lodash'
import * as React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import {
  getCertificateMetaData,
  getIsValidForSigning,
  getResourceLinks,
  isCertificateFunctionDisabled,
} from '../../../store/certificate/certificateSelectors'
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
  const certificateMetadata = useSelector(getCertificateMetaData, _.isEqual)
  const resourceLinks = useSelector(getResourceLinks, _.isEqual)
  const isValidForSigning = useSelector(getIsValidForSigning)
  const functionDisabled = useSelector(isCertificateFunctionDisabled)

  if (!certificateMetadata || !resourceLinks) return null

  const signResourceLink = getResourceLink(resourceLinks, ResourceLinkType.SIGN_CERTIFICATE)
  const forwardResourceLink = getResourceLink(resourceLinks, ResourceLinkType.FORWARD_CERTIFICATE)
  const readyForSignResourceLink = getResourceLink(resourceLinks, ResourceLinkType.READY_FOR_SIGN)
  const isReadyForSign = certificateMetadata.readyForSign !== undefined

  return (
    <Wrapper>
      {signResourceLink != null && (
        <div className="iu-flex">
          <SignAndSendButton functionDisabled={functionDisabled} {...signResourceLink} />
        </div>
      )}

      {forwardResourceLink != null && (
        <div className="iu-flex">
          <ForwardCertificateButton
            certificateId={certificateMetadata.id}
            unitName={certificateMetadata.unit.unitName}
            careProviderName={certificateMetadata.careProvider.unitName}
            forwarded={certificateMetadata.forwarded}
            functionDisabled={functionDisabled}
            {...forwardResourceLink}
          />
          {certificateMetadata.forwarded && (
            <StatusWithIcon icon="CheckIcon" additionalWrapperStyles="iu-ml-400">
              Vidarebefordrat
            </StatusWithIcon>
          )}
        </div>
      )}

      {readyForSignResourceLink && !isReadyForSign && (
        <div className="iu-flex">
          <ReadyForSignButton functionDisabled={functionDisabled} isValidForSigning={isValidForSigning} {...readyForSignResourceLink} />
        </div>
      )}

      {readyForSignResourceLink && isReadyForSign && (
        <InfoBox type="success">
          <p>Utkastet är sparat och markerat klart för signering.</p>
        </InfoBox>
      )}

      <RightWrapper>
        {(forwardResourceLink || (readyForSignResourceLink && !isReadyForSign)) && !isValidForSigning && <ShowValidationErrorsSwitch />}
        <p className="iu-fs-200">Intygs-ID: {certificateMetadata.id}</p>
      </RightWrapper>
    </Wrapper>
  )
}
