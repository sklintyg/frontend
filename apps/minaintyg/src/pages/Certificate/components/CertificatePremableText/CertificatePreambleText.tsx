import { PageHeadingDescription } from '../../../../components/PageHeading/PageHeadingDescription'
import { DisplayHTML } from '../../../../components/DisplayHTML/DisplayHTML'
import { CertificateText } from '../../../../schema/certificate.schema'

export function CertificatePreambleText({ texts }: { texts?: CertificateText }) {
  if (!texts || !texts.PREAMBLE_TEXT) {
    return null
  }
  return (
    <PageHeadingDescription>
      <DisplayHTML html={texts.PREAMBLE_TEXT} />
    </PageHeadingDescription>
  )
}
