import { IDSAlert } from '@frontend/ids-react-ts'
import { SjfMetaData } from '../../../../schemas/patientSchema'
import { useAddVardenhetMutation, useAddVardgivareMutation, useGiveSjfConsentMutation } from '../../../../store/api'
import { OpenInformationCard } from './open/OpenInformationCard'
import { BlockedInformationCard } from './blocked/BlockedInformationCard'
import { OpenInformationWithConsentCard } from './open/OpenInformationWithConsentCard'

export function PatientOverview({
  sjfMetaData,
  patientId,
  isPersonResponseMissing,
}: {
  sjfMetaData: SjfMetaData | undefined
  patientId: string
  isPersonResponseMissing: boolean
}) {
  const [addUnit] = useAddVardenhetMutation()
  const [addCareGiver] = useAddVardgivareMutation()
  const [giveConsent, { data: responseCode }] = useGiveSjfConsentMutation()

  const PROTECTED_PERSON_ALERT =
    'För patient med skyddade personuppgifter kan ingen ytterligare information hämtas från andra vårdenheter eller andra vårdgivare.'
  const PERSON_RESPONSE_MISSING_ALERT =
    'För patient där ofullständiga uppgifter hämtats från folkbokföringsregistret kan ingen ytterligare information hämtas från andra vårdenheter eller andra vårdgivare.'

  if (!sjfMetaData || !patientId) {
    return null
  }

  const handleGetCareUnitInformation = (id: string) => {
    addUnit({ patientId, vardenhetId: id })
  }

  const handleGetCareGiverInformation = (id: string) => {
    addCareGiver({ patientId, vardgivareId: id })
  }

  const handleGiveConsent = (days: string, onlyCurrentUser: boolean) => {
    const daysAsNumber = Number(days)
    giveConsent({ days: daysAsNumber, onlyCurrentUser, patientId })
  }

  if (sjfMetaData.haveSekretess || isPersonResponseMissing) {
    return <IDSAlert>{sjfMetaData.haveSekretess ? PROTECTED_PERSON_ALERT : PERSON_RESPONSE_MISSING_ALERT}</IDSAlert>
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <OpenInformationCard
        title="Ospärrad information inom vårdgivare"
        subTitle="Vårdenhet att hämta information från"
        description="Det finns ospärrad information hos en annan vårdenhet inom din vårdgivare. Du kan klicka nedan för att visa vilka vårdenheter som
        har denna information och få möjlighet att inhämta den."
        items={sjfMetaData.kraverInteSamtycke}
        onGetInformation={handleGetCareUnitInformation}
      />
      <OpenInformationWithConsentCard
        items={sjfMetaData.kraverSamtycke}
        title="Ospärrad information hos annan vårdgivare"
        subTitle="Vårdgivare med information"
        description="Det finns ospärrad information hos en annan vårdgivare. Du kan klicka nedan för att visa vilka vårdgivare som har ospärrad information. Patientens samtycke krävs för att du ska kunna ta del av informationen."
        hasGivenConsent={sjfMetaData.samtyckeFinns || responseCode === 'OK'}
        onGetInformation={handleGetCareGiverInformation}
        onGiveConsent={handleGiveConsent}
      />
      <BlockedInformationCard
        title="Spärrad information inom vårdgivare"
        subTitle="Vårdenheter"
        description="Det finns spärrad information hos en annan vårdenhet inom din vårdgivare. Endast patienten kan få spärren hävd genom att kontakta den enhet där spärren sattes. Du kan klicka nedan för att visa vilka vårdenheter som har spärrad information hos sig."
        items={sjfMetaData.vardenheterInomVGMedSparr}
      />
      <BlockedInformationCard
        items={sjfMetaData.andraVardgivareMedSparr}
        title="Spärrad information hos andra vårdgivare"
        subTitle="Vårdgivare"
        description="Det finns spärrad intygsinformation hos andra vårdgivare. Endast patienten kan häva spärren genom att kontakta den enhet där spärren sattes. Klicka nedan för att visa vilka vårdgivare som har spärrad information."
      />
    </div>
  )
}
