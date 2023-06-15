import { TableHeadingForUnit } from '../../components/Table/heading/TableHeadingForUnit'
import { useGetUserQuery } from '../../store/api'
import { LUCertificatesFilters } from './LUCertificatesFilters'

export function LUCertificates() {
  const { isLoading: userLoading, data: user } = useGetUserQuery()

  return (
    <div className="ids-content m-auto max-w-7xl py-10 px-2.5">
      <TableHeadingForUnit tableName="läkarutlåtanden" suffix="senaste tre åren" user={user} />
      <LUCertificatesFilters />
    </div>
  )
}
