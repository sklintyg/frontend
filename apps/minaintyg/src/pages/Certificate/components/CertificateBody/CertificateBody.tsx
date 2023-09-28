import { IDSExpandable } from '@frontend/ids-react-ts'
import { DisplayHTML } from '../../../../components/DisplayHTML/DisplayHTML'
import { CertificateContent } from '../../../../schema/certificate.schema'

export function CertificateBody({ content }: { content: CertificateContent[] }) {
  return (
    <>
      {content.map(({ heading, body }) => (
        <section key={heading} className="md:mb-10">
          <IDSExpandable className="md:hidden" headline={heading}>
            <DisplayHTML html={body} mobile />
          </IDSExpandable>
          <div className="hidden md:block">
            <h2 className="ids-heading-2">{heading}</h2>
            <DisplayHTML html={body} />
          </div>
        </section>
      ))}
    </>
  )
}
