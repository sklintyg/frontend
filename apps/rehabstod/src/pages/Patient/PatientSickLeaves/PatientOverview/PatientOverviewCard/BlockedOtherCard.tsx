import { SjfMetaData } from '../../../../../schemas/patientSchema'
import { PatientOverviewCard } from './PatientOverviewCard'

export function BlockedOtherCard({ sjfMetaData }: { sjfMetaData: SjfMetaData }) {
  const items = sjfMetaData.andraVardgivareMedSparr
  return (
    <PatientOverviewCard
      title="Spärrad information hos annan vårdgivare"
      subTitle="Vårdgivare"
      description="Det finns spärrad intygsinformation hos andra vårdgivare. Endast patienten kan häva spärren genom att kontakta den enhet där spärren sattes. Klicka nedan för att visa vilka vårdgivare som har spärrad information."
    >
      {items.map((item) => (
        <p key={item} className="pb-3">
          {item}
        </p>
      ))}
    </PatientOverviewCard>
  )
}
