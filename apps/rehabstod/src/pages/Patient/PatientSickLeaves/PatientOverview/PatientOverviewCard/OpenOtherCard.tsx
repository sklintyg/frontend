import { IDSButton, IDSButtonGroup, IDSErrorMessage } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { Checkbox } from '../../../../../components/Form/Checkbox'
import { FormattedNumberInput } from '../../../../../components/Form/FormattedNumberInput'
import { RadioButton } from '../../../../../components/Form/RadioButton'
import { PatientOverviewConsentChoices, SjfMetaData } from '../../../../../schemas/patientSchema'
import { useAddVardgivareMutation } from '../../../../../store/api'
import { AboutPatientOverview } from '../AboutPatientOverview'
import { OpenInformation } from './OpenInformation/OpenInformation'
import { PatientOverviewCard } from './PatientOverviewCard'

export function OpenOtherCard({
  sjfMetaData,
  patientId,
  encryptedPatientId,
  giveConsent,
}: {
  sjfMetaData: SjfMetaData
  patientId: string
  encryptedPatientId: string
  giveConsent: (data: { days: number; onlyCurrentUser: boolean; patientId: string; encryptedPatientId: string }) => void
}) {
  const items = sjfMetaData.kraverSamtycke
  const [addCareGiver] = useAddVardgivareMutation()
  const [expanded, setExpanded] = useState(false)
  const [checkedConsent, setCheckedConsent] = useState(false)
  const [daysOfConsent, setDaysOfConsent] = useState('7')
  const [consentId, setConsentId] = useState(PatientOverviewConsentChoices.ONLYCURRENT)
  const [showError, setShowError] = useState(false)

  const onGetInformation = (id: string) => addCareGiver({ patientId, vardgivareId: id })
  const onGiveConsent = (days: string, onlyCurrentUser: boolean) =>
    giveConsent({ days: Number(days), onlyCurrentUser, patientId, encryptedPatientId })

  const handleGiveConsent = () => {
    if (checkedConsent) {
      onGiveConsent(daysOfConsent, consentId === PatientOverviewConsentChoices.ONLYCURRENT)
    } else {
      setShowError(true)
    }
  }

  return (
    <PatientOverviewCard
      title="Ospärrad information hos annan vårdgivare"
      subTitle="Vårdgivare med information"
      description="Det finns ospärrad information hos en annan vårdgivare. Du kan klicka nedan för att visa vilka vårdgivare som har ospärrad information. Patientens samtycke krävs för att du ska kunna ta del av informationen."
      onExpand={() => setExpanded(true)}
      expanded={expanded}
    >
      {items.length &&
        (sjfMetaData.samtyckeFinns ? (
          <OpenInformation items={items} onGetInformation={onGetInformation} />
        ) : (
          <>
            <p className="pb-3">{items.map((item) => item.itemName).join(', ')}</p>
            <h4 className="ids-heading-4 pt-2">Samtycke sammanhållen vårddokumentation</h4>
            <Checkbox
              label="Patienten samtycker till att information hämtas från andra vårdgivare i:"
              checked={checkedConsent}
              onChange={(event) => {
                setCheckedConsent(event.currentTarget.checked)
                setShowError(false)
              }}
              compact
              valid={`${!showError}`}
              light
            />
            {showError && <IDSErrorMessage className="mb-5">Du behöver kryssa i rutan för att kunna fortsätta</IDSErrorMessage>}
            <div className="ml-10 -mt-5 flex w-44 items-center gap-3">
              <FormattedNumberInput
                label=""
                onChange={(value) => setDaysOfConsent(value)}
                value={daysOfConsent}
                max="365"
                min="1"
                defaultValue="7"
                bright
              />
              <p>dagar</p>
            </div>
            <h4 className="ids-heading-4 pt-3">Vem har samtycke?</h4>
            <RadioButton
              label="Bara jag"
              onChange={(event) => setConsentId(event.currentTarget.value as PatientOverviewConsentChoices)}
              value={PatientOverviewConsentChoices.ONLYCURRENT}
              checked={consentId === PatientOverviewConsentChoices.ONLYCURRENT}
              light
            />
            <RadioButton
              label="All behörig personal på vårdenheten"
              onChange={(event) => setConsentId(event.currentTarget.value as PatientOverviewConsentChoices)}
              value={PatientOverviewConsentChoices.ALL}
              checked={consentId === PatientOverviewConsentChoices.ALL}
              light
            />
            <div className="pt-3 pb-5">
              <AboutPatientOverview />
            </div>
            <IDSButtonGroup className="flex justify-center">
              <IDSButton secondary onClick={() => setExpanded(false)}>
                Avbryt
              </IDSButton>
              <div>
                <IDSButton onClick={handleGiveConsent}>Patienten ger samtycke</IDSButton>
              </div>
            </IDSButtonGroup>
          </>
        ))}
    </PatientOverviewCard>
  )
}
