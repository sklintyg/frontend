import { SjfMetaData } from '../../../../../schemas/patientSchema'
import { PatientOverviewCard } from './PatientOverviewCard'

export function BlockedCurrentCard({ sjfMetaData }: { sjfMetaData: SjfMetaData }) {
  const items = sjfMetaData.vardenheterInomVGMedSparr
  return (
    <PatientOverviewCard
      title="Spärrad information inom egen vårdgivare"
      subTitle="Vårdenhet"
      description="Det finns spärrad information hos en annan vårdenhet inom din vårdgivare. Endast patienten kan få spärren hävd genom att kontakta den enhet där spärren sattes. Du kan klicka nedan för att visa vilka vårdenheter som har spärrad information hos sig."
    >
      {items.map((item) => (
        <p key={item} className="pb-3">
          {item}
        </p>
      ))}
    </PatientOverviewCard>
  )
}
