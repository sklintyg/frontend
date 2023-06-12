import { IDSSelect } from '@frontend/ids-react-ts'
import { useId } from 'react'
import { useGetUserQuery } from '../../store/api'
import { getUnitsForUser } from '../../utils/getUnitsForUser'
import { Select } from '../Form/Select'
import { SettingsDialogInput } from './SettingsDialogInput'

export function SelectCareUnits({ onChange, standardenhet }: { onChange: (value: string) => void; standardenhet?: string | null }) {
  const { data: user, isLoading } = useGetUserQuery()
  const id = useId()
  if (!user || isLoading) {
    return null
  }

  return (
    <SettingsDialogInput
      title="Förvald enhet"
      description='Du kan välja en enhet som du automatiskt loggas in på när Rehabstöd startas. Välj "Ingen förvald enhet" i listan för att
        rensa ditt val.'
    >
      <div className="w-80">
        <IDSSelect className="m-0">
          <label htmlFor={id}>Välj enhet</label>
          <Select id={id} onChange={(event) => onChange(event.currentTarget.value)} value={standardenhet ?? 'Ingen förvald enhet'}>
            <option className="ml-2" value="Ingen förvald enhet">
              Ingen förvald enhet
            </option>
            {getUnitsForUser(user).map((item) => (
              <option key={item.id} value={item.id}>
                {item.namn}
              </option>
            ))}
          </Select>
        </IDSSelect>
      </div>
    </SettingsDialogInput>
  )
}
