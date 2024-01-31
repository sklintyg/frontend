import React from 'react'
import styled from 'styled-components'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'
import CopyCertificateButton from '../Buttons/CopyCertificateButton'
import CopyCertificateContinueButton from '../Buttons/CopyCertificateContinueButton'
import CreateCertificateFromTemplateButton from '../Buttons/CreateCertificateFromTemplateButton'
import PrintCertificateButton from '../Buttons/PrintCertificateButton'
import RemoveCertificateButton from '../Buttons/RemoveCertificateButton'
import RenewCertificateButton from '../Buttons/RenewCertificateButton'
import ReplaceCertificateButton from '../Buttons/ReplaceCertificateButton'
import ReplaceCertificateContinueButton from '../Buttons/ReplaceCertificateContinueButton'
import RevokeCertificateButton from '../Buttons/RevokeCertificateButton'
import SendCertificateButton from '../Buttons/SendCertificateButton'
import ShowRelatedCertificateButton from '../Buttons/ShowRelatedCertificateButton'
import { ResourceLink, CertificateMetadata, ResourceLinkType } from '../../../types'
import { resourceLinksAreEqual, getResourceLink } from '../../../utils'

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
