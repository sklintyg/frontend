import { CertificateEvent } from '../../../../../schema/certificate.schema'
import { CertificateEventsInfo } from '../../CertificateEventsInfo/CertificateEventsInfo'
import { CertificateCardEventsAccordion } from './CertificateCardEventsAccordion'

export function CertificateCardEvents({ events }: { events: CertificateEvent[] }) {
  return (
    <>
      <div className="md:hidden">
        <CertificateCardEventsAccordion>
          <CertificateEventsInfo events={events} />
        </CertificateCardEventsAccordion>
      </div>
      <div className="hidden md:block">
        <CertificateEventsInfo events={events} />
      </div>
    </>
  )
}
