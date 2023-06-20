import { User, UserUrval } from '../../../schemas'
import { TableHeading } from './TableHeading'

export function TableHeadingForUnit({ user, tableName, suffix }: { user?: User; tableName: string; suffix?: string }) {
  const isDoctor = user?.urval === UserUrval.ISSUED_BY_ME // TODO: refactor to utils
  const prefix = isDoctor ? 'Mina' : 'Alla'

  return (
    <TableHeading
      title={`${prefix} ${tableName} ${suffix || ''}`}
      subTitle={user && user.valdVardenhet ? user.valdVardenhet.namn : ''}
      printTitle={`${prefix} ${tableName} på ${user && user.valdVardenhet ? user.valdVardenhet.namn : ''} ${suffix || ''}`}
    />
  )
}
