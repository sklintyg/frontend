import { MaxColspanRow } from './tableBody/MaxColspanRow'
import { User } from '../../schemas'

export function EmptyPatientTableMessage({ tableName, tableLength, user }: { tableName: string; tableLength: number; user: User }) {
  return (
    <MaxColspanRow colspan={tableLength}>{`Patienten har inga ${tableName} på ${
      user.valdVardenhet ? user.valdVardenhet.namn : 'enheten'
    }.`}</MaxColspanRow>
  )
}