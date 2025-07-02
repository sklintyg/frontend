import { IDSAccordion } from '@inera/ids-react'
import { DisplayHTML } from '../../../../components/DisplayHTML/DisplayHTML'
import type { CertificateContent } from '../../../../schema/certificate.schema'

export function CertificateBody({ content }: { content: CertificateContent[] }) {
  return (
    <>
      {content.map(({ heading, body }) => (
        <div key={heading} className="border-b border-neutral-90">
          <IDSAccordion headline={heading}>
            <DisplayHTML html={body} />
          </IDSAccordion>
        </div>
      ))}
    </>
  )
}
