import styled from 'styled-components'
import { WithResourceLink } from '../../../components/utils/WithResourceLink'
import type { CertificateMetadata, ResourceLink } from '../../../types'
import { ResourceLinkType } from '../../../types'
import type { FunctionDisabled } from '../../../utils/functionDisablerUtils'
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

const Wrapper = styled.div`
  display: flex;
  padding: 0.3125rem 0 0;
  flex-wrap: wrap;
  justify-content: end;
  gap: 4px 1em;
  flex: 0 0 auto;
  align-items: flex-start;
`

interface Props extends FunctionDisabled {
  resourceLinks: ResourceLink[]
  certificateMetadata: CertificateMetadata
}

export function HeaderButtons({ resourceLinks, certificateMetadata, functionDisabled }: Props) {
  return (
    <Wrapper>
      <WithResourceLink type={ResourceLinkType.SHOW_RELATED_CERTIFICATE} links={resourceLinks}>
        {(link) => <ShowRelatedCertificateButton certificateId={certificateMetadata.id} functionDisabled={false} {...link} />}
      </WithResourceLink>
      <WithResourceLink type={ResourceLinkType.CREATE_CERTIFICATE_FROM_TEMPLATE} links={resourceLinks}>
        {(link) => <CreateCertificateFromTemplateButton {...link} certificateMetadata={certificateMetadata} />}
      </WithResourceLink>
      <WithResourceLink type={ResourceLinkType.SEND_CERTIFICATE} links={resourceLinks}>
        {(link) => <SendCertificateButton {...link} certificateMetadata={certificateMetadata} functionDisabled={functionDisabled} />}
      </WithResourceLink>
      <WithResourceLink type={ResourceLinkType.COPY_CERTIFICATE} links={resourceLinks}>
        {(link) => <CopyCertificateButton {...link} certificateMetadata={certificateMetadata} functionDisabled={functionDisabled} />}
      </WithResourceLink>
      <WithResourceLink type={ResourceLinkType.COPY_CERTIFICATE_CONTINUE} links={resourceLinks}>
        {(link) => (
          <CopyCertificateContinueButton {...link} certificateMetadata={certificateMetadata} functionDisabled={functionDisabled} />
        )}
      </WithResourceLink>
      <WithResourceLink type={ResourceLinkType.PRINT_CERTIFICATE} links={resourceLinks}>
        {(link) => <PrintCertificateButton {...link} certificateMetadata={certificateMetadata} />}
      </WithResourceLink>
      <WithResourceLink type={ResourceLinkType.RENEW_CERTIFICATE} links={resourceLinks}>
        {(link) => <RenewCertificateButton {...link} certificateId={certificateMetadata.id} functionDisabled={functionDisabled} />}
      </WithResourceLink>
      <WithResourceLink type={ResourceLinkType.REPLACE_CERTIFICATE} links={resourceLinks}>
        {(link) => <ReplaceCertificateButton {...link} functionDisabled={functionDisabled} />}
      </WithResourceLink>
      <WithResourceLink type={ResourceLinkType.REPLACE_CERTIFICATE_CONTINUE} links={resourceLinks}>
        {(link) => (
          <ReplaceCertificateContinueButton {...link} certificateMetadata={certificateMetadata} functionDisabled={functionDisabled} />
        )}
      </WithResourceLink>
      <WithResourceLink type={ResourceLinkType.REMOVE_CERTIFICATE} links={resourceLinks}>
        {(link) => <RemoveCertificateButton {...link} certificateMetadata={certificateMetadata} functionDisabled={functionDisabled} />}
      </WithResourceLink>
      <WithResourceLink type={ResourceLinkType.REVOKE_CERTIFICATE} links={resourceLinks}>
        {(link) => <RevokeCertificateButton {...link} functionDisabled={functionDisabled} />}
      </WithResourceLink>
    </Wrapper>
  )
}
