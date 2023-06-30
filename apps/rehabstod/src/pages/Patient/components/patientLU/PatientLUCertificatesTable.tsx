import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { EmptyPatientTableMessage } from '../../../../components/Table/EmptyPatientTableMessage'
import { Table } from '../../../../components/Table/Table'
import { TableHeadingForUnit } from '../../../../components/Table/heading/TableHeadingForUnit'
import { TableHeader } from '../../../../components/Table/tableHeader/TableHeader'
import {
  filterHiddenColumns,
  filterPatientViewColumns,
  filterTableColumn,
  filterTableColumns,
} from '../../../../components/Table/utils/filterTableColumns'
import { PatientTableError } from '../../../../components/error/ErrorAlert/PatientTableError'
import { useGetPatientLUCertificatesQuery, useGetUserQuery } from '../../../../store/api'
import { useAppSelector } from '../../../../store/hooks'
import { LUCertificatesColumn } from '../../../../store/slices/lakarutlatandeUnitTableColumns.slice'
import { allLakarutlatandenTableColumns } from '../../../../store/slices/lakarutlatandenTableColumns.selector'
import { isUserDoctor } from '../../../../utils/isUserDoctor'
import { LUCertificatesTableBody } from '../../../LUCertificates/LUCertificatesTableBody'
import { getLUCertificatesColumnInfo } from '../../../LUCertificates/utils/getLUCertificatesColumnsInfo'
import { ModifyPatientLUCertificatesTableColumns } from './ModifyPatientLUCertificatesTableColumns'

export function PatientLUCertificatesTable() {
  const { data: user } = useGetUserQuery()
  const { encryptedPatientId } = useParams()
  const { showPersonalInformation } = useAppSelector((state) => state.settings)
  const [tableState, setTableState] = useState<{ sortColumn: string; ascending: boolean }>({
    sortColumn: LUCertificatesColumn.Signeringsdatum,
    ascending: false,
  })
  const allColumns = useAppSelector(allLakarutlatandenTableColumns)
  const isDoctor = user ? isUserDoctor(user) : false
  const patientViewColumns = allColumns.filter(({ name }) => filterPatientViewColumns(name))
  const filteredColumns = filterTableColumns(patientViewColumns, isDoctor, showPersonalInformation, false)
  const visibleColumns = filterHiddenColumns(filteredColumns)
  const { data: luCertificatesInfo, error: getLuCertificatesError } = useGetPatientLUCertificatesQuery({
    encryptedPatientId: encryptedPatientId || '',
  })

  return (
    <>
      <div className="flex justify-between">
        <TableHeadingForUnit tableName="Patientens läkarutlåtanden" hideUserSpecifics hideDivider user={user} />
        {!getLuCertificatesError && (
          <div className="w-96">
            <ModifyPatientLUCertificatesTableColumns columns={filterTableColumn(filteredColumns, LUCertificatesColumn.Visa)} />
          </div>
        )}
      </div>
      {getLuCertificatesError ? (
        <PatientTableError error={getLuCertificatesError} />
      ) : (
        <Table sortColumn={tableState.sortColumn} onSortChange={setTableState} ascending={tableState.ascending}>
          <TableHeader columns={visibleColumns.map((column) => getLUCertificatesColumnInfo(column.name))} />
          {!luCertificatesInfo || luCertificatesInfo.certificates.length === 0 ? (
            <tbody>
              <EmptyPatientTableMessage tableName="läkarutlåtanden" tableLength={visibleColumns.length} user={user} />
            </tbody>
          ) : (
            <LUCertificatesTableBody content={luCertificatesInfo ? luCertificatesInfo.certificates : []} columns={visibleColumns} />
          )}
        </Table>
      )}
    </>
  )
}
