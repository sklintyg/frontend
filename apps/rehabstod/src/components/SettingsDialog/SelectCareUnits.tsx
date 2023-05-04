import { IDSSelect } from '@frontend/ids-react-ts'
import { useId } from 'react'
import { useGetUserQuery } from '../../store/api'
import { getUnitsForUser } from '../../utils/getUnitsForUser'
import { Select } from '../Form/Select'

export function SelectCareUnits({ onChange, standardenhet }: { onChange: (value: string) => void; standardenhet?: string | null }) {
  const { data: user, isLoading } = useGetUserQuery()
  const id = useId()
  if (!user || isLoading) {
    return null
  }

  return (
    <div className="[&:not(:last-child)]:mb-5">
      <h2 className="ids-heading-4">Förvald enhet</h2>
      <p>
        Du kan välja en enhet som du automatiskt loggas in på när Rehabstöd startas. Välj &quot;Ingen förvald enhet&quot; i listan för att
        rensa ditt val.
      </p>
      <div className="w-80">
        <IDSSelect>
          <label htmlFor={id}>Välj enhet</label>
          <div>
            <Select
              id={id}
              name="options"
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
            </Select>
          </div>
        </IDSSelect>
      </div>
    </div>
  )
}
