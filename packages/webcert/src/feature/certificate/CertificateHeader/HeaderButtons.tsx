import { ResourceLink, ResourceLinkType, resourceLinksAreEqual, getResourceLink } from '@frontend/common'
import React from 'react'
import RemoveCertificateButton from '../Buttons/RemoveCertificateButton'
import PrintCertificateButton from '../Buttons/PrintCertificateButton'
import ReplaceCertificateButton from '../Buttons/ReplaceCertificateButton'
import RevokeCertificateButton from '../Buttons/RevokeCertificateButton'
import CopyCertificateButton from '../Buttons/CopyCertificateButton'
import SendCertificateButton from '../Buttons/SendCertificateButton'
import styled from 'styled-components'
import { ResourceLinkChooseReceivers, ResourceLinkSend } from '@frontend/common'
import ChooseReceiverButton from '../Buttons/ChooseReceiverButton'

const Wrapper = styled.div`
  margin-bottom: 4px;
  display: flex;
  align-items: flex-end;

  > .button-tooltip:not(:first-child) {
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
        <SendCertificateButton {...(getResourceLink(resourceLinks, ResourceLinkType.SEND_CERTIFICATE) as ResourceLinkSend)} />
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
      {resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.CHOOSE_RECEIVERS)) && (
        <ChooseReceiverButton {...(getResourceLink(resourceLinks, ResourceLinkType.CHOOSE_RECEIVERS) as ResourceLinkChooseReceivers)} />
      )}
    </Wrapper>
  )
}

export default HeaderButtons
