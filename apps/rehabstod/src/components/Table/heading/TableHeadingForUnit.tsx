import { User } from '../../../schemas'
import { TableHeading } from './TableHeading'
import { isUserDoctor } from '../../../utils/isUserDoctor'

export function TableHeadingForUnit({ user, tableName, suffix }: { user?: User; tableName: string; suffix?: string }) {
  if (!user) {
    return null
  }

  const prefix = isUserDoctor(user) ? 'Mina' : 'Alla'

  return (
    <TableHeading
      title={`${prefix} ${tableName} ${suffix || ''}`}
      subTitle={user && user.valdVardenhet ? user.valdVardenhet.namn : ''}
      printTitle={`${prefix} ${tableName} på ${user && user.valdVardenhet ? user.valdVardenhet.namn : ''} ${suffix || ''}`}
    />
  )
}
