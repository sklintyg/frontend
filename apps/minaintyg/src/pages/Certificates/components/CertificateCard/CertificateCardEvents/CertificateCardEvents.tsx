import { CertificateListEvent } from '../../../../../schema/certificateList.schema'
import { CertificateCardEventsAccordion } from './CertificateCardEventsAccordion'
import { CertificateCardEventsInfo } from './CertificateCardEventsInfo'

export function CertificateCardEvents({ events }: { events: CertificateListEvent[] }) {
  return (
    <>
      <div className="md:hidden">
        <CertificateCardEventsAccordion>
          <CertificateCardEventsInfo events={events} />
        </CertificateCardEventsAccordion>
      </div>
      <div className="hidden md:block">
        <CertificateCardEventsInfo events={events} />
      </div>
    </>
  )
}
