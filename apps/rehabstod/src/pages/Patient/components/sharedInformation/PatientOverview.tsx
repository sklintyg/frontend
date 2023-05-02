import { PatientOverviewCard } from './PatientOverviewCard'
import { SjfMetaData } from '../../../../schemas/patientSchema'
import { useAddVardenhetMutation } from '../../../../store/api'

export function PatientOverview({ sjfMetaData, patientId }: { sjfMetaData: SjfMetaData | undefined; patientId: string }) {
  const [addUnit, { data: includedUnits }] = useAddVardenhetMutation()

  if (!sjfMetaData || !patientId) {
    return null
  }

  const handleGetCareUnitInformation = (id: string) => {
    addUnit({ patientId, vardenhetId: id })
  }

  return (
    <div>
      <PatientOverviewCard
        title="Ospärrad information inom vårdgivare"
        subTitle="Vårdenhet att hämta information från"
        description="Det finns ospärrad information hos en annan vårdenhet inom din vårdgivare. Du kan klicka nedan för att visa vilka vårdenheter som
        har denna information och få möjlighet att inhämta den."
        items={sjfMetaData.kraverInteSamtycke}
        includedItems={
          includedUnits
            ? includedUnits.concat(
                sjfMetaData ? sjfMetaData.kraverInteSamtycke.filter((item) => item.includedInSjukfall).map((item) => item.itemId) : []
              )
            : []
        }
        onGetInformation={handleGetCareUnitInformation}
      />
    </div>
  )
}
