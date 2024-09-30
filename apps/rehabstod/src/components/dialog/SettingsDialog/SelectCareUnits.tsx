import { Select } from 'components'
import { useId } from 'react'
import { useGetUserQuery } from '../../../store/api'
import { getUnitsForUser } from '../../../utils/getUnitsForUser'
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
      <div className="max-w-xs">
        <Select
          id={id}
          label="Välj enhet"
          value={standardenhet ?? ''}
          onChange={(event) => onChange(event.currentTarget.value)}
          options={[
            { value: '', label: 'Ingen förvald enhet' },
            ...getUnitsForUser(user).map((unit) => ({ value: unit.id, label: unit.namn })),
          ]}
        />
      </div>
    </SettingsDialogInput>
  )
}
