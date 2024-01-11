import { TableHeadingForUnit } from '../../../components/Table/heading/TableHeadingForUnit'
import { User } from '../../../schemas'

export function CurrentSickLeavesHeading({ user }: { user?: User }) {
  return <TableHeadingForUnit user={user} tableName="pågående sjukfall" />
}
