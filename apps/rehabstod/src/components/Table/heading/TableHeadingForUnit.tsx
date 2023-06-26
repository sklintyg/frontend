import { User } from '../../../schemas'
import { TableHeading } from './TableHeading'
import { isUserDoctor } from '../../../utils/isUserDoctor'

export function TableHeadingForUnit({
  user,
  tableName,
  suffix,
  hideUserSpecifics,
  hideDivider = false,
}: {
  user?: User
  tableName: string
  suffix?: string
  hideUserSpecifics: boolean
  hideDivider?: boolean
}) {
  if (!user) {
    return null
  }

  const prefix = isUserDoctor(user) ? 'Mina' : 'Alla'

  return (
    <TableHeading
      hideDivider={hideDivider}
      title={`${!hideUserSpecifics ? prefix : ''} ${tableName} ${suffix || ''}`}
      subTitle={user && user.valdVardenhet ? user.valdVardenhet.namn : ''}
      printTitle={`${!hideUserSpecifics ? prefix : ''} ${tableName} på ${user && user.valdVardenhet ? user.valdVardenhet.namn : ''} ${
        suffix || ''
      }`}
    />
  )
}
