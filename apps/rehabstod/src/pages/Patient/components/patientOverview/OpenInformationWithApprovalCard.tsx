import { PatientOverviewCard } from './PatientOverviewCard'
import { SjfItem } from '../../../../schemas/patientSchema'
import { OpenInformationWithApproval } from './OpenInformationWithApproval'

export function OpenInformationWithApprovalCard({
  items,
  onGetInformation,
  onGiveApproval,
  title,
  subTitle,
  description,
  hasGivenApproval,
}: {
  items: SjfItem[]
  onGetInformation: (id: string) => void
  onGiveApproval: (days: string, onlyCurrentUser: boolean) => void
  title: string
  subTitle: string
  description: string
  hasGivenApproval?: boolean
}) {
  return (
    <PatientOverviewCard title={title} subTitle={subTitle} description={description} isEmpty={!items || items.length === 0}>
      <OpenInformationWithApproval
        onGiveApproval={onGiveApproval}
        hasApproval={!!hasGivenApproval}
        items={items}
        onGetInformation={onGetInformation}
      />
    </PatientOverviewCard>
  )
}
