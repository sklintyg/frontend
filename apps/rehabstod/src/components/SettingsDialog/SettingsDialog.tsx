import { IDSButton, IDSButtonGroup, IDSDialog } from '@frontend/ids-react-ts'
import { ReactNode, useState } from 'react'
import { NumberInput } from '../Form/NumberInput'
import { useUpdateUserPreferencesMutation } from '../../store/api'
import { UserPreferences } from '../../schemas'

export function SettingsDialog({
  preferences,
  children,
  show,
  onClose,
}: {
  preferences: UserPreferences | undefined
  children: ReactNode
  show: string
  onClose: () => void
}) {
  const [UpdateUserPreferences] = useUpdateUserPreferencesMutation()
  const [savedPreferences, setSavedPreferences] = useState<UserPreferences | undefined>(preferences)

  if (!savedPreferences) {
    return null
  }

  const onSave = () => {
    if (savedPreferences) {
      UpdateUserPreferences(savedPreferences)
    }
    onClose()
  }

  return (
    <IDSDialog dismissible headline="Inställningar" show={show}>
      {children}
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
          id="daysAfterSickLeaveEnd"
          value={savedPreferences.maxAntalDagarSedanSjukfallAvslut ? Number(savedPreferences.maxAntalDagarSedanSjukfallAvslut) : 0}
          max={14}
          min={0}
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
          id="daysBetweenSickLeaves"
          value={savedPreferences.maxAntalDagarMellanIntyg ? Number(savedPreferences.maxAntalDagarMellanIntyg) : 0}
          max={90}
          min={0}
          className="w-72"
        />
      </div>
      <IDSButtonGroup className="justify-center pt-5">
        <IDSButton secondary onClick={onClose}>
          Avbryt
        </IDSButton>
        <IDSButton onClick={onSave}>Spara</IDSButton>
      </IDSButtonGroup>
    </IDSDialog>
  )
}
