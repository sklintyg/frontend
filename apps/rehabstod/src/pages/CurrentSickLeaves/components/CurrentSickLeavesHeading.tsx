import { User } from '../../../schemas'
import { TableHeadingForUnit } from '../../../components/Table/heading/TableHeadingForUnit'

export function CurrentSickLeavesHeading({ user }: { user?: User }) {
  return <TableHeadingForUnit user={user} tableName="pågående sjukfall" />
}
