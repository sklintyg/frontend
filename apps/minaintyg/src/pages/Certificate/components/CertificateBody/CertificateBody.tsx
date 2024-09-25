import { IDSExpandable } from '@frontend/ids-react-ts'
import { DisplayHTML } from '../../../../components/DisplayHTML/DisplayHTML'
import type { CertificateContent } from '../../../../schema/certificate.schema'

export function CertificateBody({ content }: { content: CertificateContent[] }) {
  return (
    <>
      {content.map(({ heading, body }) => (
        <div key={heading} className="border-b border-neutral-90">
          <IDSExpandable headline={heading}>
            <DisplayHTML html={body} />
          </IDSExpandable>
        </div>
      ))}
    </>
  )
}
