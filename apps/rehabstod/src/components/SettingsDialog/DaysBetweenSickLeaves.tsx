import { ComponentProps } from 'react'
import { DAYS_BETWEEN_SICK_LEAVES } from '../../schemas'
import { useGetUserQuery } from '../../store/api'
import { FormattedNumberInput } from '../Form/FormattedNumberInput'
import { SettingsDialogInput } from './SettingsDialogInput'

export function DaysBetweenSickLeaves({ value, onChange }: Pick<ComponentProps<typeof FormattedNumberInput>, 'value' | 'onChange'>) {
  const { data: user, isLoading } = useGetUserQuery()
  if (!user || isLoading) {
    return null
  }

  return (
    <SettingsDialogInput
      title="Antal dagar mellan intyg"
      description="Välj hur många dagars uppehåll det maximalt får vara mellan två intyg för att de ska räknas till samma sjukfall.">
      <div className="w-80">
        <FormattedNumberInput
          label="Dagar mellan intyg (0-90 dagar)"
          onChange={onChange}
          value={value}
          max={DAYS_BETWEEN_SICK_LEAVES.MAX.toString()}
          min={DAYS_BETWEEN_SICK_LEAVES.MIN.toString()}
          defaultValue={user.preferences.maxAntalDagarMellanIntyg}
        />
      </div>
    </SettingsDialogInput>
  )
}
