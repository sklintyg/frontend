import { ResourceLink, ResourceLinkType, resourceLinksAreEqual, getResourceLink } from '@frontend/common'
import React from 'react'
import RemoveCertificateButton from '../Buttons/RemoveCertificateButton'
import PrintCertificateButton from '../Buttons/PrintCertificateButton'
import ReplaceCertificateButton from '../Buttons/ReplaceCertificateButton'
import RevokeCertificateButton from '../Buttons/RevokeCertificateButton'
import CopyCertificateButton from '../Buttons/CopyCertificateButton'
import SendCertificateButton from '../Buttons/SendCertificateButton'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin-bottom: 4px;
  display: flex;
  align-items: flex-end;

  > * + * {
    margin-left: 8px;
  }
`

interface Props {
  resourceLinks: ResourceLink[]
}

const HeaderButtons: React.FC<Props> = ({ resourceLinks }) => {
  return (
    <Wrapper>
      {resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.SEND_CERTIFICATE)) && (
        <SendCertificateButton {...getResourceLink(resourceLinks, ResourceLinkType.SEND_CERTIFICATE)} />
      )}
      {resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.COPY_CERTIFICATE)) && (
        <CopyCertificateButton {...getResourceLink(resourceLinks, ResourceLinkType.COPY_CERTIFICATE)} />
      )}
      {resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.PRINT_CERTIFICATE)) && (
        <PrintCertificateButton {...getResourceLink(resourceLinks, ResourceLinkType.PRINT_CERTIFICATE)} />
      )}
      {resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.REPLACE_CERTIFICATE)) && (
        <ReplaceCertificateButton {...getResourceLink(resourceLinks, ResourceLinkType.REPLACE_CERTIFICATE)} />
      )}
      {resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.REMOVE_CERTIFICATE)) && (
        <RemoveCertificateButton {...getResourceLink(resourceLinks, ResourceLinkType.REMOVE_CERTIFICATE)} />
      )}
      {resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.REVOKE_CERTIFICATE)) && (
        <RevokeCertificateButton {...getResourceLink(resourceLinks, ResourceLinkType.REVOKE_CERTIFICATE)} />
      )}
    </Wrapper>
  )
}

export default HeaderButtons
