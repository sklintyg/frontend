import { SjfMetaData } from '../../../../schemas/patientSchema'
import { useAddVardenhetMutation } from '../../../../store/api'
import { OpenInformationCard } from './OpenInformationCard'
import { BlockedInformationCard } from './BlockedInformationCard'

export function PatientOverview({ sjfMetaData, patientId }: { sjfMetaData: SjfMetaData | undefined; patientId: string }) {
  const [addUnit] = useAddVardenhetMutation()

  if (!sjfMetaData || !patientId) {
    return null
  }

  const handleGetCareUnitInformation = (id: string) => {
    addUnit({ patientId, vardenhetId: id })
  }

  return (
    <div>
      <OpenInformationCard
        title="Ospärrad information inom vårdgivare"
        subTitle="Vårdenhet att hämta information från"
        description="Det finns ospärrad information hos en annan vårdenhet inom din vårdgivare. Du kan klicka nedan för att visa vilka vårdenheter som
        har denna information och få möjlighet att inhämta den."
        items={sjfMetaData.kraverInteSamtycke}
        onGetInformation={handleGetCareUnitInformation}
      />
      <BlockedInformationCard
        title="Spärrad information inom vårdgivare"
        subTitle="Vårdenhet att hämta information från"
        description="Det finns spärrad information hos en annan vårdenhet inom din vårdgivare. Endast patienten kan få spärren hävd genom att kontakta den enhet där spärren sattes. Du kan klicka nedan för att visa vilka vårdenheter som har spärrad information hos sig."
        items={sjfMetaData.vardenheterInomVGMedSparr}
      />
    </div>
  )
}
