import { ReactNode } from 'react'
import { CertificateEvent } from '../../../../../schema/certificate.schema'
import { CertificateEventsInfo } from '../../CertificateEventsInfo/CertificateEventsInfo'
import { CertificateCardEventsAccordion } from './CertificateCardEventsAccordion'

export function CertificateCardEvents({ events, heading }: { events: CertificateEvent[]; heading: ReactNode }) {
  return (
    <>
      <div className="md:hidden">
        <CertificateCardEventsAccordion>
          {heading}
          <CertificateEventsInfo events={events} />
        </CertificateCardEventsAccordion>
      </div>
      <div className="hidden md:block">
        {heading}
        <CertificateEventsInfo events={events} />
      </div>
    </>
  )
}
