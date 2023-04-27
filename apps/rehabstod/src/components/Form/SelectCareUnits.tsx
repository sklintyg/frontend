import { IDSSelect } from '@frontend/ids-react-ts'
import { Mottagning, UserPreferences, Vardenhet } from '../../schemas'

export function SelectCareUnits({
  content,
  preferences,
  onChange,
}: {
  content: (Vardenhet | Mottagning)[]
  preferences: UserPreferences
  onChange: (value: string) => void
}) {
  return (
    <IDSSelect>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label>Förvald enhet</label>
      <select name="options" className="h-12 flex-1 border" onChange={(event) => onChange(event.currentTarget.value)}>
        <option className="ml-2" value="Ingen förvald enhet" selected={preferences.standardenhet === null}>
          Ingen förvald enhet
        </option>
        {content.map((item) => (
          <option key={item.id} value={item.id} selected={preferences.standardenhet === item.id}>
            {item.namn}
          </option>
        ))}
      </select>
    </IDSSelect>
  )
}
