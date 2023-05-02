import { OpenInformation } from './OpenInformation'
import { PatientOverviewCard } from './PatientOverviewCard'
import { SjfItem } from '../../../../schemas/patientSchema'

export function OpenInformationCard({
  items,
  onGetInformation,
  title,
  subTitle,
  description,
}: {
  items: SjfItem[]
  onGetInformation: (id: string) => void
  title: string
  subTitle: string
  description: string
}) {
  return (
    <PatientOverviewCard title={title} subTitle={subTitle} description={description} isEmpty={items.length === 0}>
      <OpenInformation items={items} onGetInformation={onGetInformation} />
    </PatientOverviewCard>
  )
}
