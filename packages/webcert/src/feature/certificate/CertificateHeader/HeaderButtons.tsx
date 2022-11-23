import { CertificateMetadata, getResourceLink, ResourceLink, resourceLinksAreEqual, ResourceLinkType } from '@frontend/common'
import React from 'react'
import RemoveCertificateButton from '../Buttons/RemoveCertificateButton'
import PrintCertificateButton from '../Buttons/PrintCertificateButton'
import ReplaceCertificateButton from '../Buttons/ReplaceCertificateButton'
import RevokeCertificateButton from '../Buttons/RevokeCertificateButton'
import CopyCertificateButton from '../Buttons/CopyCertificateButton'
import SendCertificateButton from '../Buttons/SendCertificateButton'
import styled from 'styled-components'
import RenewCertificateButton from '../Buttons/RenewCertificateButton'
import ReplaceCertificateContinueButton from '../Buttons/ReplaceCertificateContinueButton'
import CreateCertificateFromTemplateButton from '../Buttons/CreateCertificateFromTemplateButton'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'
import CopyCertificateContinueButton from '../Buttons/CopyCertificateContinueButton'
import ShowRelatedCertificateButton from '../Buttons/ShowRelatedCertificateButton'

const Wrapper = styled.div`
  margin-bottom: 4px;
  display: flex;
  align-items: flex-end;

  > .custom-button:not(:first-child) {
    margin-left: 8px;
  }
`

interface Props extends FunctionDisabled {
  resourceLinks: ResourceLink[]
  certificateMetadata: CertificateMetadata
}

const HeaderButtons: React.FC<Props> = ({ resourceLinks, certificateMetadata, functionDisabled }) => {
  return (
    <Wrapper>
      {resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.SHOW_RELATED_CERTIFICATE)) && (
        <ShowRelatedCertificateButton
          certificateId={certificateMetadata.id}
          functionDisabled={false}
          {...getResourceLink(resourceLinks, ResourceLinkType.SHOW_RELATED_CERTIFICATE)}
        />
      )}
      {resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.CREATE_CERTIFICATE_FROM_TEMPLATE)) && (
        <CreateCertificateFromTemplateButton
          {...getResourceLink(resourceLinks, ResourceLinkType.CREATE_CERTIFICATE_FROM_TEMPLATE)}
          certificateMetadata={certificateMetadata}
        />
      )}
      {resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.SEND_CERTIFICATE)) && (
        <SendCertificateButton
          {...getResourceLink(resourceLinks, ResourceLinkType.SEND_CERTIFICATE)}
          certificateMetadata={certificateMetadata}
          functionDisabled={functionDisabled}
        />
      )}
      {resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.COPY_CERTIFICATE)) && (
        <CopyCertificateButton
          {...getResourceLink(resourceLinks, ResourceLinkType.COPY_CERTIFICATE)}
          certificateMetadata={certificateMetadata}
          functionDisabled={functionDisabled}
        />
      )}
      {resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.COPY_CERTIFICATE_CONTINUE)) && (
        <CopyCertificateContinueButton
          {...getResourceLink(resourceLinks, ResourceLinkType.COPY_CERTIFICATE_CONTINUE)}
          certificateMetadata={certificateMetadata}
          functionDisabled={functionDisabled}
        />
      )}
      {resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.PRINT_CERTIFICATE)) && (
        <PrintCertificateButton
          {...getResourceLink(resourceLinks, ResourceLinkType.PRINT_CERTIFICATE)}
          certificateMetadata={certificateMetadata}
        />
      )}
      {resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.RENEW_CERTIFICATE)) && (
        <RenewCertificateButton
          {...getResourceLink(resourceLinks, ResourceLinkType.RENEW_CERTIFICATE)}
          certificateId={certificateMetadata.id}
          functionDisabled={functionDisabled}
        />
      )}
      {resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.REPLACE_CERTIFICATE)) && (
        <ReplaceCertificateButton
          {...getResourceLink(resourceLinks, ResourceLinkType.REPLACE_CERTIFICATE)}
          functionDisabled={functionDisabled}
        />
      )}
      {resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.REPLACE_CERTIFICATE_CONTINUE)) && (
        <ReplaceCertificateContinueButton
          {...getResourceLink(resourceLinks, ResourceLinkType.REPLACE_CERTIFICATE_CONTINUE)}
          certificateMetadata={certificateMetadata}
          functionDisabled={functionDisabled}
        />
      )}
      {resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.REMOVE_CERTIFICATE)) && (
        <RemoveCertificateButton
          {...getResourceLink(resourceLinks, ResourceLinkType.REMOVE_CERTIFICATE)}
          certificateMetadata={certificateMetadata}
          functionDisabled={functionDisabled}
        />
      )}
      {resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.REVOKE_CERTIFICATE)) && (
        <RevokeCertificateButton
          {...getResourceLink(resourceLinks, ResourceLinkType.REVOKE_CERTIFICATE)}
          functionDisabled={functionDisabled}
        />
      )}
    </Wrapper>
  )
}

export default HeaderButtons
