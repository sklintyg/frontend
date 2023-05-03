import { PatientOverviewCard } from './PatientOverviewCard'
import { BlockedInformation } from './BlockedInformation'

export function BlockedInformationCard({
  items,
  title,
  subTitle,
  description,
}: {
  items: string[]
  title: string
  subTitle: string
  description: string
}) {
  return (
    <PatientOverviewCard title={title} subTitle={subTitle} description={description} isEmpty={!items || items.length === 0}>
      <BlockedInformation items={items} />
    </PatientOverviewCard>
  )
}
