import { PatientOverviewCard } from './PatientOverviewCard'
import { SjfMetaData } from '../../../../schemas/patientSchema'

export function PatientOverview({ sjfMetaData }: { sjfMetaData: SjfMetaData }) {
  return (
    <div>
      <PatientOverviewCard
        title="Ospärrad information inom vårdgivare"
        subTitle="Vårdenhet att hämta information från"
        description="Det finns ospärrad information hos en annan vårdenhet inom din vårdgivare. Du kan klicka nedan för att visa vilka vårdenheter som
        har denna information och få möjlighet att inhämta den."
        items={sjfMetaData.kraverInteSamtycke}
      />
    </div>
  )
}
