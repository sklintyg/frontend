import { IDSSelect } from '@frontend/ids-react-ts'
import { useId } from 'react'
import { UserPreferences } from '../../schemas'
import { useGetUserQuery } from '../../store/api'
import { getUnitsForUser } from '../../utils/getUnitsForUser'

export function SelectCareUnits({ onChange, preferences }: { onChange: (value: string) => void; preferences: UserPreferences }) {
  const { isLoading, data: user } = useGetUserQuery()
  const id = useId()
  if (!user || isLoading) {
    return null
  }

  return (
    <IDSSelect>
      <label className="mb-0" htmlFor={id}>
        Förvald enhet
      </label>
      <select
        id={id}
        name="options"
        className="text-neutral-20 my-3 box-border w-full truncate rounded border py-3 px-5 text-left"
        onChange={(event) => onChange(event.currentTarget.value)}
        value={preferences.standardenhet ?? 'Ingen förvald enhet'}>
        <option className="ml-2" value="Ingen förvald enhet">
          Ingen förvald enhet
        </option>
        {getUnitsForUser(user).map((item) => (
          <option key={item.id} value={item.id}>
            {item.namn}
          </option>
        ))}
      </select>
    </IDSSelect>
  )
}
