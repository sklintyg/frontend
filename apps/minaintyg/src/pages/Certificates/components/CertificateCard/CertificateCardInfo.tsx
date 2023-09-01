import { CertificateListIssuer } from '../../../../schema/certificateList.schema'

export function CertificateCardInfo({ issuer, id }: { issuer: CertificateListIssuer; id: string }) {
  return (
    <div className="mb-2.5 flex flex-col justify-between gap-2.5 md:flex-row">
      <div>
        <p className="font-bold">Utfärdare:</p>
        <p>{issuer.name}</p>
      </div>
      <div>
        <p className="font-bold">Intygs-ID:</p>
        <p>{id}</p>
      </div>
    </div>
  )
}
