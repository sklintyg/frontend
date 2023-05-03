import { PatientOverviewCard } from './PatientOverviewCard'
import { SjfItem } from '../../../../schemas/patientSchema'
import { OpenInformationWithConsent } from './OpenInformationWithConsent'

export function OpenInformationWithConsentCard({
  items,
  onGetInformation,
  onGiveConsent,
  title,
  subTitle,
  description,
  hasGivenConsent,
}: {
  items: SjfItem[]
  onGetInformation: (id: string) => void
  onGiveConsent: (days: string, onlyCurrentUser: boolean) => void
  title: string
  subTitle: string
  description: string
  hasGivenConsent?: boolean
}) {
  return (
    <PatientOverviewCard title={title} subTitle={subTitle} description={description} isEmpty={!items || items.length === 0}>
      <OpenInformationWithConsent
        onGiveConsent={onGiveConsent}
        hasConsent={!!hasGivenConsent}
        items={items}
        onGetInformation={onGetInformation}
      />
    </PatientOverviewCard>
  )
}
