import { IDSButton, IDSButtonGroup } from '@frontend/ids-react-ts'
import { UserPreferences } from '../../schemas'
import { useUpdateUserPreferencesMutation } from '../../store/api'
import { isValueBetweenLimits } from '../../utils/isValueBetweenLimits'
import { FormattedNumberInput } from '../Form/FormattedNumberInput'
import { SelectCareUnits } from '../Form/SelectCareUnits'

export function SettingsDialogContent({
  preferences,
  onClose,
  onChange,
}: {
  preferences: UserPreferences | undefined
  onClose: () => void
  onChange: (preferences: UserPreferences) => void
}) {
  const [updateUserPreferences] = useUpdateUserPreferencesMutation()
  const minDaysBetweenSickLeaves = 0
  const maxDaysBetweenSickLeaves = 90
  const minDaysFinishedSickLeave = 0
  const maxDaysFinishedSickLeave = 14

  if (!preferences) {
    return null
  }

  const isMaxAntalDagarMellanIntygValid = isValueBetweenLimits(
    maxDaysBetweenSickLeaves,
    minDaysBetweenSickLeaves,
    parseInt(preferences.maxAntalDagarMellanIntyg, 10)
  )
  const isMaxAntalDagarSedanSjukfallAvslutValid = isValueBetweenLimits(
    maxDaysFinishedSickLeave,
    minDaysFinishedSickLeave,
    parseInt(preferences.maxAntalDagarSedanSjukfallAvslut, 10)
  )
  const isSaveEnabled = isMaxAntalDagarSedanSjukfallAvslutValid && isMaxAntalDagarMellanIntygValid

  const onSave = () => {
    if (preferences) {
      updateUserPreferences(preferences)
      onClose()
    }
  }

  return (
    <>
      <div>
        <h2 className="ids-heading-4">Visa nyligen avslutade sjukfall</h2>
        <p className="pb-4">
          Välj maximalt antal dagar som får ha passerat efter ett sjukfalls slutdatum för att sjukfallet ska visas upp i sjukfallstabellen.
          Med denna funktion kan du bevaka de sjukfall som är nyligen avslutade.{' '}
        </p>
        <div className="w-80">
          <FormattedNumberInput
            label="Max antal dagar sedan avslut  (0-14 dagar)"
            onChange={(value) =>
              onChange({
                ...preferences,
                maxAntalDagarSedanSjukfallAvslut: value,
              })
            }
            value={preferences.maxAntalDagarSedanSjukfallAvslut}
            max={maxDaysFinishedSickLeave.toString()}
            min={minDaysFinishedSickLeave.toString()}
            defaultValue={preferences.maxAntalDagarSedanSjukfallAvslut}
          />
        </div>
      </div>
      <div className="py-5">
        <h2 className="ids-heading-4">Antal dagar mellan intyg</h2>
        <p className="pb-4">
          Välj hur många dagars uppehåll det maximalt får vara mellan två intyg för att de ska räknas till samma sjukfall.{' '}
        </p>
        <div className="w-80">
          <FormattedNumberInput
            label="Dagar mellan intyg (0-90 dagar)"
            onChange={(value) =>
              onChange({
                ...preferences,
                maxAntalDagarMellanIntyg: value,
              })
            }
            value={preferences.maxAntalDagarMellanIntyg}
            max={maxDaysBetweenSickLeaves.toString()}
            min={minDaysBetweenSickLeaves.toString()}
            defaultValue={preferences.maxAntalDagarMellanIntyg}
          />
        </div>
      </div>
      <div className="py-5">
        <h2 className="ids-heading-4">Förvald enhet</h2>
        <p>
          Du kan välja en enhet som du automatiskt loggas in på när Rehabstöd startas. Välj &quot;Ingen förvald enhet&quot; i listan för att
          rensa ditt val.{' '}
        </p>
        <div className="w-80">
          <SelectCareUnits
            preferences={preferences}
            onChange={(value) =>
              onChange({
                ...preferences,
                standardenhet: value !== 'Ingen förvald enhet' ? value : null,
              })
            }
          />
        </div>
      </div>
      <IDSButtonGroup className="justify-center pt-5">
        <IDSButton secondary onClick={onClose}>
          Avbryt
        </IDSButton>
        <IDSButton onClick={onSave} disabled={!isSaveEnabled}>
          Spara
        </IDSButton>
      </IDSButtonGroup>
    </>
  )
}
