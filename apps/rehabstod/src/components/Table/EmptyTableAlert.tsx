import { IDSAlert } from '@inera/ids-react'
import { useGetUserQuery } from '../../store/api'
import { getEmptyTableText } from './utils/tableTextGeneratorUtils'

export function EmptyTableAlert({ tableName }: { tableName: string }) {
  const { data: user } = useGetUserQuery()
  return (
    <div className="py-10">
      <IDSAlert compact>{getEmptyTableText(user, tableName)}</IDSAlert>
    </div>
  )
}
