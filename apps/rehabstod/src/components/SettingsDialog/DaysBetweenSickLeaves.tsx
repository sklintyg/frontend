import { DAYS_BETWEEN_SICK_LEAVES } from '../../schemas'
import { useGetUserQuery } from '../../store/api'
import { FormattedNumberInput } from '../Form/FormattedNumberInput'

export function DaysBetweenSickLeaves({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const { data: user, isLoading } = useGetUserQuery()
  if (!user || isLoading) {
    return null
  }

  return (
    <div className="[&:not(:last-child)]:mb-5">
      <h2 className="ids-heading-4">Antal dagar mellan intyg</h2>
      <p className="pb-4">
        Välj hur många dagars uppehåll det maximalt får vara mellan två intyg för att de ska räknas till samma sjukfall.
      </p>
      <div className="w-80">
        <FormattedNumberInput
          label="Dagar mellan intyg (0-90 dagar)"
          onChange={onChange}
          value={value}
          max={DAYS_BETWEEN_SICK_LEAVES.MAX}
          min={DAYS_BETWEEN_SICK_LEAVES.MIN}
          defaultValue={user.preferences.maxAntalDagarMellanIntyg}
        />
      </div>
    </div>
  )
}
