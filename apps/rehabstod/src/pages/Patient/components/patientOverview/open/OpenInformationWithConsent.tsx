import { useState } from 'react'
import { IDSButton, IDSButtonGroup, IDSErrorMessage } from '@frontend/ids-react-ts'
import { PatientOverviewConsentChoices, SjfItem } from '../../../../../schemas/patientSchema'
import { Checkbox } from '../../../../../components/Form/Checkbox'
import { FormattedNumberInput } from '../../../../../components/Form/FormattedNumberInput'
import { RadioButton } from '../../../../../components/Form/RadioButton'
import { OpenInformation } from './OpenInformation'
import { BlockedInformation } from '../blocked/BlockedInformation'
import { AboutConsentDialog } from '../dialog/AboutConsentDialog'
import { AboutPatientOverviewDialog } from '../dialog/AboutPatientOverviewDialog'

export function OpenInformationWithConsent({
  items,
  onGetInformation,
  onGiveConsent,
  onClose,
  hasGivenConsent,
}: {
  items: SjfItem[]
  onGetInformation: (id: string) => void
  onGiveConsent: (days: string, onlyCurrentUser: boolean) => void
  onClose: () => void
  hasGivenConsent: boolean
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

  return hasGivenConsent ? (
    <OpenInformation items={items} onGetInformation={onGetInformation} />
  ) : (
    <>
      <BlockedInformation items={items.map((item) => item.itemName)} />
      <h4 className="ids-heading-4 pt-2">Samtycke sammanhållen journalföring</h4>
      <Checkbox
        label="Patienten samtycker till att information hämtas från andra vårdgivare i:"
        checked={checkedConsent}
        onChange={(event) => {
          setCheckedConsent(event.currentTarget.checked)
          setShowError(false)
        }}
        className="bg-white"
        compact
        valid={`${!showError}`}
      />
      {showError && <IDSErrorMessage>Du behöver kryssa i rutan för att kunna fortsätta</IDSErrorMessage>}
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
      />
      <RadioButton
        label="All behörig personal på vårdenheten"
        onChange={(event) => setConsentId(event.currentTarget.value as PatientOverviewConsentChoices)}
        value={PatientOverviewConsentChoices.ALL}
        checked={consentId === PatientOverviewConsentChoices.ALL}
      />
      <div className="pt-3 pb-5">
        <AboutConsentDialog />
        <AboutPatientOverviewDialog />
      </div>
      <IDSButtonGroup className="flex justify-center">
        <IDSButton secondary onClick={onClose}>
          Avbryt
        </IDSButton>
        <div>
          <IDSButton onClick={handleGiveConsent}>Patienten ger samtycke</IDSButton>
        </div>
      </IDSButtonGroup>
    </>
  )
}
