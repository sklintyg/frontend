import { IDSAlert } from '@frontend/ids-react-ts'
import { isUserDoctor } from '../../utils/isUserDoctor'
import { useGetUserQuery } from '../../store/api'

export function EmptyTableAlert({ tableName }: { tableName: string }) {
  const { data: user } = useGetUserQuery()
  const isDoctor = user ? isUserDoctor(user) : false
  return (
    <IDSAlert className="py-10">
      {isDoctor ? 'Du har' : 'Det finns'} inga {tableName} på {user && user.valdVardenhet ? user.valdVardenhet.namn : ''}.
    </IDSAlert>
  )
}
