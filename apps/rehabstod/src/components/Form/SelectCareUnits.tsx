import { IDSSelect } from '@frontend/ids-react-ts'
import { Mottagning, UserPreferences, Vardenhet } from '../../schemas'
import { useGetUserQuery } from '../../store/api'

export function SelectCareUnits({ onChange, preferences }: { onChange: (value: string) => void; preferences: UserPreferences }) {
  const { data: user } = useGetUserQuery()

  function getUnits(): (Vardenhet | Mottagning)[] {
    if (!user) {
      return []
    }
    const units: (Vardenhet | Mottagning)[] = []
    user.vardgivare.forEach((careProvider) => {
      careProvider.vardenheter.forEach((careUnit) => {
        units.push(careUnit)
        if (careUnit.mottagningar && careUnit.mottagningar.length > 0) {
          careUnit.mottagningar.forEach((reception) => units.push(reception))
        }
      })
    })
    return units
  }

  return (
    <IDSSelect>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label>Förvald enhet</label>
      <select
        name="options"
        className="text-neutral-20 my-3 box-border w-full truncate rounded border py-3 px-5 text-left"
        onChange={(event) => onChange(event.currentTarget.value)}
        value={preferences.standardenhet ? preferences.standardenhet : 'Ingen förvald enhet'}>
        <option className="ml-2" value="Ingen förvald enhet">
          Ingen förvald enhet
        </option>
        {getUnits().map((item) => (
          <option key={item.id} value={item.id}>
            {item.namn}
          </option>
        ))}
      </select>
    </IDSSelect>
  )
}
