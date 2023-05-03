import { useState } from 'react'
import { IDSButton, IDSButtonGroup } from '@frontend/ids-react-ts'
import { PatientOverviewConsentChoices, SjfItem } from '../../../../schemas/patientSchema'
import { Checkbox } from '../../../../components/Form/Checkbox'
import { FormattedNumberInput } from '../../../../components/Form/FormattedNumberInput'
import { RadioButton } from '../../../../components/Form/RadioButton'
import { OpenInformation } from './OpenInformation'
import { BlockedInformation } from './BlockedInformation'

export function OpenInformationWithConsent({
  items,
  onGetInformation,
  onGiveConsent,
  hasConsent,
}: {
  items: SjfItem[]
  onGetInformation: (id: string) => void
  onGiveConsent: (days: string, onlyCurrentUser: boolean) => void
  hasConsent: boolean
}) {
  const [checkedConsent, setCheckedConsent] = useState(false)
  const [daysOfConsent, setDaysOfConsent] = useState('7')
  const [consentId, setConsentId] = useState(PatientOverviewConsentChoices.ONLYCURRENT)
  const [showError, setShowError] = useState(false)

  const handleGiveConsent = () => {
    if (checkedConsent) {
      onGiveConsent(daysOfConsent, consentId === PatientOverviewConsentChoices.ONLYCURRENT)
    } else {
      setShowError(true)
    }
  }

  return hasConsent ? (
    <OpenInformation items={items} onGetInformation={onGetInformation} />
  ) : (
    <>
      <BlockedInformation items={items.map((item) => item.itemName)} />
      <h4 className="ids-heading-4 pt-5">Samtycke sammanhållen journalföring</h4>
      <Checkbox
        label="Patienten samtycker till att information hämtas från andra vårdgivare i:"
        checked={checkedConsent}
        onChange={(event) => {
          setCheckedConsent(event.currentTarget.checked)
          setShowError(false)
        }}
        className="bg-white"
      />
      <div className="flex w-44 items-center gap-3">
        <FormattedNumberInput
          label=""
          onChange={(value) => setDaysOfConsent(value)}
          value={daysOfConsent}
          max="365"
          min="1"
          defaultValue="7"
        />
        <p>dagar</p>
      </div>
      <h4 className="ids-heading-4">Vem har samtycke?</h4>
      <RadioButton
        label="Bara jag"
        onChange={(event) => setConsentId(event.currentTarget.value as PatientOverviewConsentChoices)}
        value={PatientOverviewConsentChoices.ONLYCURRENT}
        checked={consentId === PatientOverviewConsentChoices.ONLYCURRENT}
      />
      <RadioButton
        label="All behörig personal på vårdenheten"
        onChange={(event) => setConsentId(event.currentTarget.value as PatientOverviewConsentChoices)}
        value={PatientOverviewConsentChoices.ALL}
        checked={consentId === PatientOverviewConsentChoices.ALL}
      />
      <IDSButtonGroup className="flex justify-center">
        <IDSButton secondary>Avbryt</IDSButton>
        <div>
          <IDSButton onClick={handleGiveConsent}>Patienten ger samtycke</IDSButton>
          {showError && <p className="text-error-40">Checkboxen för samtycke måste kryssas i för att fortsätta.</p>}
        </div>
      </IDSButtonGroup>
    </>
  )
}
