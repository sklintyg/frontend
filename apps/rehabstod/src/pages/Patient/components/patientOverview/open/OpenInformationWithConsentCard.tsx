import { useState } from 'react'
import { PatientOverviewCard } from '../PatientOverviewCard'
import type { SjfItem } from '../../../../../schemas/patientSchema'
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
  hasGivenConsent: boolean
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <PatientOverviewCard
      title={title}
      subTitle={subTitle}
      description={description}
      isEmpty={!items || items.length === 0}
      onExpand={() => setExpanded(true)}
      expanded={expanded}
    >
      <OpenInformationWithConsent
        onClose={() => setExpanded(false)}
        onGiveConsent={onGiveConsent}
        hasGivenConsent={hasGivenConsent}
        items={items}
        onGetInformation={onGetInformation}
      />
    </PatientOverviewCard>
  )
}
