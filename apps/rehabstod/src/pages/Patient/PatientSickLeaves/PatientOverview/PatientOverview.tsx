import { IDSAlert } from '@frontend/ids-react-ts'
import { ErrorModal } from '../../../../components/error/ErrorModal/ErrorModal'
import { ErrorCode } from '../../../../schemas/errorSchema'
import { SjfMetaData } from '../../../../schemas/patientSchema'
import { useGiveSjfConsentMutation } from '../../../../store/api'
import { BlockedCurrentCard } from './PatientOverviewCard/BlockedCurrentCard'
import { BlockedOtherCard } from './PatientOverviewCard/BlockedOtherCard'
import { OpenCurrentCard } from './PatientOverviewCard/OpenCurrentCard'
import { OpenOtherCard } from './PatientOverviewCard/OpenOtherCard'

export function PatientOverview({
  sjfMetaData,
  patientId,
  isPersonResponseMissing,
  encryptedPatientId,
}: {
  sjfMetaData?: SjfMetaData
  patientId: string
  isPersonResponseMissing: boolean
  encryptedPatientId: string
}) {
  const [giveConsent, { data: consentResponse, error: giveConsentError }] = useGiveSjfConsentMutation()

  const PROTECTED_PERSON_ALERT =
    'För patient med skyddade personuppgifter kan ingen ytterligare information hämtas från andra vårdenheter eller andra vårdgivare.'
  const PERSON_RESPONSE_MISSING_ALERT =
    'För patient där ofullständiga uppgifter hämtats från folkbokföringsregistret kan ingen ytterligare information hämtas från andra vårdenheter eller andra vårdgivare.'

  if (!sjfMetaData || !patientId) {
    return null
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
      <div className="grid grid-cols-2 gap-4 py-5">
        <OpenCurrentCard sjfMetaData={sjfMetaData} patientId={patientId} />
        <OpenOtherCard sjfMetaData={sjfMetaData} patientId={patientId} encryptedPatientId={encryptedPatientId} giveConsent={giveConsent} />
        <BlockedCurrentCard sjfMetaData={sjfMetaData} />
        <BlockedOtherCard sjfMetaData={sjfMetaData} />
      </div>
    </>
  )
}
