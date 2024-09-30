import { IDSAlert } from 'ids-react-ts'
import { useGetUserQuery } from '../../store/api'
import { getEmptyTableText } from './utils/tableTextGeneratorUtils'

export function EmptyTableAlert({ tableName }: { tableName: string }) {
  const { data: user } = useGetUserQuery()
  return <IDSAlert className="py-10">{getEmptyTableText(user, tableName)}</IDSAlert>
}
