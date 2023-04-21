import { IDSButton, IDSButtonGroup } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { UserPreferences } from '../../schemas'
import { useUpdateUserPreferencesMutation } from '../../store/api'
import { NumberInput } from '../Form/NumberInput'

export function SettingsDialogContent({ preferences, onClose }: { preferences: UserPreferences | undefined; onClose: () => void }) {
  const [updateUserPreferences] = useUpdateUserPreferencesMutation()
  const [savedPreferences, setSavedPreferences] = useState<UserPreferences | undefined>(preferences)
  const minDaysBetweenSickLeaves = 0
  const maxDaysBetweenSickLeaves = 90
  const minDaysFinishedSickLeave = 0
  const maxDaysFinishedSickLeave = 14

  if (!savedPreferences) {
    return null
  }

  const isValueBetweenLimits = (max: number, min: number, value: string) => value && Number(value) <= max && Number(value) >= min

  const onSave = () => {
    if (savedPreferences) {
      updateUserPreferences(savedPreferences)
      onClose()
    }
  }

  const isSaveEnabled = () =>
    isValueBetweenLimits(maxDaysFinishedSickLeave, minDaysFinishedSickLeave, savedPreferences.maxAntalDagarSedanSjukfallAvslut) &&
    isValueBetweenLimits(maxDaysBetweenSickLeaves, minDaysBetweenSickLeaves, savedPreferences.maxAntalDagarMellanIntyg)

  return (
    <>
      <div>
        <h2 className="ids-heading-4">Visa nyligen avslutade sjukfall</h2>
        <p>
          Välj maximalt antal dagar som får ha passerat efter ett sjukfalls slutdatum för att sjukfallet ska visas upp i sjukfallstabellen.
          Med denna funktion kan du bevaka de sjukfall som är nyligen avslutade. Välj 0-14 dagar.
        </p>
        <NumberInput
          label="Max antal dagar sedan avslut"
          onChange={(event) =>
            setSavedPreferences({
              ...savedPreferences,
              maxAntalDagarSedanSjukfallAvslut: event.currentTarget.value,
            })
          }
          value={savedPreferences.maxAntalDagarSedanSjukfallAvslut}
          max={maxDaysFinishedSickLeave}
          min={minDaysFinishedSickLeave}
          className="w-72"
        />
      </div>
      <div className="py-5">
        <h2 className="ids-heading-4">Antal dagar mellan intyg</h2>
        <p>
          Välj hur många dagars uppehåll det maximalt får vara mellan två intyg för att de ska räknas till samma sjukfall. Välj 0-90 dagar.
        </p>
        <NumberInput
          label="Dagar mellan intyg"
          onChange={(event) =>
            setSavedPreferences({
              ...savedPreferences,
              maxAntalDagarMellanIntyg: event.currentTarget.value,
            })
          }
          value={savedPreferences.maxAntalDagarMellanIntyg}
          max={maxDaysBetweenSickLeaves}
          min={minDaysBetweenSickLeaves}
          className="w-72"
        />
      </div>
      <IDSButtonGroup className="justify-center pt-5">
        <IDSButton secondary onClick={onClose}>
          Avbryt
        </IDSButton>
        <IDSButton onClick={onSave} disabled={!isSaveEnabled()}>
          Spara
        </IDSButton>
      </IDSButtonGroup>
    </>
  )
}
