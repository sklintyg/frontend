import { IDSButton, IDSErrorMessage } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { Checkbox } from '../../../../../components/Form/Checkbox'
import { FormattedNumberInput } from '../../../../../components/Form/FormattedNumberInput'
import { RadioButton } from '../../../../../components/Form/RadioButton'
import { PatientOverviewConsentChoices, SjfItem } from '../../../../../schemas/patientSchema'
import { AboutPatientOverview } from '../AboutPatientOverview'
import { BlockedInformation } from '../blocked/BlockedInformation'
import { OpenInformation } from './OpenInformation'

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
      <BlockedInformation items={items.map((item) => item.itemName)} inline />
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
      <div className="-mt-5 ml-10 flex w-44 items-center gap-3">
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
      <div className="pb-5 pt-3">
        <AboutPatientOverview />
      </div>
      <div className="flex flex-col gap-5 md:flex-row md:justify-center">
        <IDSButton mblock secondary onClick={onClose}>
          <span className="text-sm sm:text-base">Avbryt</span>
        </IDSButton>
        <IDSButton mblock onClick={handleGiveConsent}>
          <span className="text-sm sm:text-base">Patienten ger samtycke</span>
        </IDSButton>
      </div>
    </>
  )
}
