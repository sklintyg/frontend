import * as React from 'react'
import { useSelector } from 'react-redux'
import { getResourceLink, resourceLinksAreEqual, ResourceLinkType, StatusWithIcon } from '@frontend/common'
import { getCertificateMetaData, getIsValidForSigning, getResourceLinks } from '../../../store/certificate/certificateSelectors'
import SignAndSendButton from '../Buttons/SignAndSendButton'
import ForwardCertificateButton from '../Buttons/ForwardCertificateButton'
import ShowValidationErrorsSwitch from './ShowValidationErrorsSwitch'
import styled from 'styled-components/macro'
import _ from 'lodash'

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 16px 0;
  justify-content: space-between;
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

  if (!certificateMetadata || !resourceLinks) return null

  //TODO: we're overwiting this until we've added more data from the backend. Otherwise the button says "Signera" only.
  // Currently we got two links, "sign" and "send", and we're only checking for sign here.
  // This works currently because AF00213 only supports a combination of sign and send.

  const canSign = resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.SIGN_CERTIFICATE))
  const canForward =
    resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.FORWARD_CERTIFICATE)) &&
    !resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.SIGN_CERTIFICATE))

  return (
    <Wrapper>
      {canSign && (
        <div className={'iu-flex'}>
          <SignAndSendButton {...{ ...getResourceLink(resourceLinks, ResourceLinkType.SIGN_CERTIFICATE) }} />
        </div>
      )}

      {canForward && (
        <div className={'iu-flex'}>
          <ForwardCertificateButton {...getResourceLink(resourceLinks, ResourceLinkType.FORWARD_CERTIFICATE)} />
          {certificateMetadata.forwarded && (
            <StatusWithIcon icon="CheckIcon" additionalWrapperStyles={'iu-ml-400'}>
              Vidarebefordrat
            </StatusWithIcon>
          )}
        </div>
      )}
      <RightWrapper>
        {canForward && !isValidForSigning && <ShowValidationErrorsSwitch />}
        <p className={'iu-fs-200'}>Intygs-ID: {certificateMetadata.id}</p>
      </RightWrapper>
    </Wrapper>
  )
}
