import { ComponentProps } from 'react'
import { DAYS_FINISHED_SICK_LEAVE } from '../../schemas/userSchema'
import { useGetUserQuery } from '../../store/api'
import { FormattedNumberInput } from '../Form/FormattedNumberInput'

export function DaysFinishedSickLeave({ value, onChange }: Pick<ComponentProps<typeof FormattedNumberInput>, 'value' | 'onChange'>) {
  const { data: user, isLoading } = useGetUserQuery()
  if (!user || isLoading) {
    return null
  }

  return (
    <div className="[&:not(:last-child)]:mb-5">
      <h2 className="ids-heading-4">Visa nyligen avslutade sjukfall</h2>
      <p className="pb-4">
        Välj maximalt antal dagar som får ha passerat efter ett sjukfalls slutdatum för att sjukfallet ska visas upp i sjukfallstabellen.
        Med denna funktion kan du bevaka de sjukfall som är nyligen avslutade.
      </p>
      <div className="w-80">
        <FormattedNumberInput
          label="Max antal dagar sedan avslut (0-14 dagar)"
          onChange={onChange}
          value={value}
          max={DAYS_FINISHED_SICK_LEAVE.MAX.toString()}
          min={DAYS_FINISHED_SICK_LEAVE.MIN.toString()}
          defaultValue={user.preferences.maxAntalDagarSedanSjukfallAvslut}
        />
      </div>
    </div>
  )
}
