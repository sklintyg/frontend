import { IDSSelect } from '@frontend/ids-react-ts'
import { useId } from 'react'
import { useGetUserQuery } from '../../store/api'
import { getUnitsForUser } from '../../utils/getUnitsForUser'

export function SelectCareUnits({ onChange, standardenhet }: { onChange: (value: string) => void; standardenhet?: string | null }) {
  const { isLoading, data: user } = useGetUserQuery()
  const id = useId()
  if (!user || isLoading) {
    return null
  }

  return (
    <IDSSelect>
      <label htmlFor={id}>Välj enhet</label>
      <div>
        <select
          id={id}
          name="options"
          className="text-neutral-20 box-border w-full appearance-none truncate rounded border py-3 px-4 pl-5 pr-12 text-left"
          onChange={(event) => onChange(event.currentTarget.value)}
          value={standardenhet ?? 'Ingen förvald enhet'}>
          <option className="ml-2" value="Ingen förvald enhet">
            Ingen förvald enhet
          </option>
          {getUnitsForUser(user).map((item) => (
            <option key={item.id} value={item.id}>
              {item.namn}
            </option>
          ))}
        </select>
      </div>
    </IDSSelect>
  )
}
