import { SjfMetaData } from '../../../../../schemas/patientSchema'
import { useAddVardenhetMutation } from '../../../../../store/api'
import { OpenInformation } from './OpenInformation/OpenInformation'
import { PatientOverviewCard } from './PatientOverviewCard'

export function OpenCurrentCard({ sjfMetaData, patientId }: { sjfMetaData: SjfMetaData; patientId: string }) {
  const [addUnit] = useAddVardenhetMutation()
  const items = sjfMetaData.kraverInteSamtycke

  return (
    <PatientOverviewCard
      title="Ospärrad information inom egen vårdgivare"
      subTitle="Vårdenhet med information"
      description="Det finns ospärrad information hos en annan vårdenhet inom din vårdgivare. Du kan klicka nedan för att visa vilka vårdenheter som
  har denna information och få möjlighet att inhämta den."
    >
      {items.length && <OpenInformation items={items} onGetInformation={(id: string) => addUnit({ patientId, vardenhetId: id })} />}
    </PatientOverviewCard>
  )
}
