import { CertificateMetadata, getResourceLink, ResourceLink, ResourceLinkType } from '@frontend/common'
import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'
import CopyCertificateButton from '../Buttons/CopyCertificateButton'
import CreateCertificateFromTemplateButton from '../Buttons/CreateCertificateFromTemplateButton'
import PrintCertificateButton from '../Buttons/PrintCertificateButton'
import RemoveCertificateButton from '../Buttons/RemoveCertificateButton'
import RenewCertificateButton from '../Buttons/RenewCertificateButton'
import ReplaceCertificateButton from '../Buttons/ReplaceCertificateButton'
import ReplaceCertificateContinueButton from '../Buttons/ReplaceCertificateContinueButton'
import RevokeCertificateButton from '../Buttons/RevokeCertificateButton'
import SendCertificateButton from '../Buttons/SendCertificateButton'

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

const withResourceLink = (link: ResourceLink | undefined, callback: (link: ResourceLink) => ReactElement) => link != null && callback(link)

const HeaderButtons: React.FC<Props> = ({ resourceLinks, certificateMetadata, functionDisabled }) => {
  return (
    <Wrapper>
      {withResourceLink(getResourceLink(resourceLinks, ResourceLinkType.CREATE_CERTIFICATE_FROM_TEMPLATE), (link) => {
        return <CreateCertificateFromTemplateButton {...link} certificateMetadata={certificateMetadata} />
      })}

      {withResourceLink(getResourceLink(resourceLinks, ResourceLinkType.SEND_CERTIFICATE), (link) => {
        return <SendCertificateButton {...link} certificateMetadata={certificateMetadata} functionDisabled={functionDisabled} />
      })}

      {withResourceLink(getResourceLink(resourceLinks, ResourceLinkType.COPY_CERTIFICATE), (link) => {
        return <CopyCertificateButton {...link} certificateMetadata={certificateMetadata} functionDisabled={functionDisabled} />
      })}

      {withResourceLink(getResourceLink(resourceLinks, ResourceLinkType.PRINT_CERTIFICATE), (link) => {
        return <PrintCertificateButton {...link} certificateMetadata={certificateMetadata} />
      })}

      {withResourceLink(getResourceLink(resourceLinks, ResourceLinkType.RENEW_CERTIFICATE), (link) => {
        return <RenewCertificateButton {...link} certificateId={certificateMetadata.id} functionDisabled={functionDisabled} />
      })}

      {withResourceLink(getResourceLink(resourceLinks, ResourceLinkType.REPLACE_CERTIFICATE), (link) => {
        return <ReplaceCertificateButton {...link} functionDisabled={functionDisabled} />
      })}

      {withResourceLink(getResourceLink(resourceLinks, ResourceLinkType.REPLACE_CERTIFICATE_CONTINUE), (link) => {
        return <ReplaceCertificateContinueButton {...link} certificateMetadata={certificateMetadata} functionDisabled={functionDisabled} />
      })}

      {withResourceLink(getResourceLink(resourceLinks, ResourceLinkType.REMOVE_CERTIFICATE), (link) => {
        return <RemoveCertificateButton {...link} certificateMetadata={certificateMetadata} functionDisabled={functionDisabled} />
      })}

      {withResourceLink(getResourceLink(resourceLinks, ResourceLinkType.REVOKE_CERTIFICATE), (link) => {
        return <RevokeCertificateButton {...link} functionDisabled={functionDisabled} />
      })}
    </Wrapper>
  )
}

export default HeaderButtons
