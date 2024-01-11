import { OpenInformation } from './OpenInformation'
import { SjfItem } from '../../../../../schemas/patientSchema'
import { PatientOverviewCard } from '../PatientOverviewCard'

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
    <PatientOverviewCard title={title} subTitle={subTitle} description={description} isEmpty={!items || items.length === 0}>
      <OpenInformation items={items} onGetInformation={onGetInformation} />
    </PatientOverviewCard>
  )
}
