import { CertificateListIssuer } from '../../../../schema/certificateList.schema'

export function CertificateCardInfo({ issuer, id }: { issuer: CertificateListIssuer; id: string }) {
  return (
    <div className="mb-2.5 flex flex-col justify-between gap-2.5 border-b pb-5 md:flex-row md:border-0 md:pb-0">
      <div>
        <p className="font-bold after:content-[':'] md:after:content-['']">Utfärdare</p>
        <p>{issuer.name}</p>
      </div>
      <div className="hidden md:block">
        <p className="font-bold after:content-[':'] md:after:content-['']">Intygs-ID</p>
        <p>{id}</p>
      </div>
    </div>
  )
}
