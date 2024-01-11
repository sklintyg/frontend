import { ReactNode } from 'react'
import { CertificateCardEventsAccordion } from './CertificateCardEventsAccordion'
import { CertificateEvent } from '../../../../../schema/certificate.schema'
import { CertificateEventsInfo } from '../../CertificateEventsInfo/CertificateEventsInfo'

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
