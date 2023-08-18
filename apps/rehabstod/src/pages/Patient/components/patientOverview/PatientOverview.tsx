import { IDSAlert } from '@frontend/ids-react-ts'
import { ErrorModal } from '../../../../components/error/ErrorModal/ErrorModal'
import { ErrorCode } from '../../../../schemas/errorSchema'
import { SjfMetaData } from '../../../../schemas/patientSchema'
import { useAddVardenhetMutation, useAddVardgivareMutation, useGiveSjfConsentMutation } from '../../../../store/api'
import { BlockedInformationCard } from './blocked/BlockedInformationCard'
import { OpenInformationCard } from './open/OpenInformationCard'
import { OpenInformationWithConsentCard } from './open/OpenInformationWithConsentCard'

export function PatientOverview({
  sjfMetaData,
  patientId,
  isPersonResponseMissing,
  encryptedPatientId,
}: {
  sjfMetaData: SjfMetaData | undefined
  patientId: string
  isPersonResponseMissing: boolean
  encryptedPatientId: string
}) {
  const [addUnit] = useAddVardenhetMutation()
  const [addCareGiver] = useAddVardgivareMutation()
  const [giveConsent, { data: consentResponse, error: giveConsentError }] = useGiveSjfConsentMutation()

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
    giveConsent({ days: daysAsNumber, onlyCurrentUser, patientId, encryptedPatientId })
  }

  if (sjfMetaData.haveSekretess || isPersonResponseMissing) {
    return <IDSAlert>{sjfMetaData.haveSekretess ? PROTECTED_PERSON_ALERT : PERSON_RESPONSE_MISSING_ALERT}</IDSAlert>
  }

  if (sjfMetaData.consentServiceError || sjfMetaData.blockingServiceError) {
    return (
      <ErrorModal
        show={sjfMetaData.consentServiceError || sjfMetaData.blockingServiceError}
        description={
          sjfMetaData.consentServiceError
            ? 'Information från andra vårdgivare kan inte hämtas på grund av ett tekniskt fel. Försök igen om en stund.'
            : 'Information kan inte hämtas på grund av ett tekniskt fel. Försök igen om en stund.'
        }
        dynamicLink
        errorCode={sjfMetaData.consentServiceError ? ErrorCode.SJF_CONSENT_SERVICE_ERROR : ErrorCode.SJF_BLOCKING_SERVICE_ERROR}
        generateError
      />
    )
  }

  return (
    <>
      <ErrorModal
        show={giveConsentError !== undefined || (consentResponse && consentResponse.responseCode !== 'OK')}
        description="Samtycke kan inte registreras på grund av ett tekniskt fel. Försök igen om en stund."
        errorCode={ErrorCode.REGISTER_SJF_CONSENT_ERROR}
        generateError={giveConsentError === undefined}
        dynamicLink
      />
      <div className="flex grid-cols-2 flex-col gap-5 py-5 lg:grid">
        <OpenInformationCard
          title="Ospärrad information inom egen vårdgivare"
          subTitle="Vårdenhet med information"
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
          hasGivenConsent={sjfMetaData.samtyckeFinns}
          onGetInformation={handleGetCareGiverInformation}
          onGiveConsent={handleGiveConsent}
        />
        <BlockedInformationCard
          title="Spärrad information inom egen vårdgivare"
          subTitle="Vårdenhet"
          description="Det finns spärrad information hos en annan vårdenhet inom din vårdgivare. Endast patienten kan få spärren hävd genom att kontakta den enhet där spärren sattes. Du kan klicka nedan för att visa vilka vårdenheter som har spärrad information hos sig."
          items={sjfMetaData.vardenheterInomVGMedSparr}
        />
        <BlockedInformationCard
          items={sjfMetaData.andraVardgivareMedSparr}
          title="Spärrad information hos annan vårdgivare"
          subTitle="Vårdgivare"
          description="Det finns spärrad intygsinformation hos andra vårdgivare. Endast patienten kan häva spärren genom att kontakta den enhet där spärren sattes. Klicka nedan för att visa vilka vårdgivare som har spärrad information."
        />
      </div>
    </>
  )
}
