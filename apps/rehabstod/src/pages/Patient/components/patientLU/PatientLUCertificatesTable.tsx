import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { EmptyPatientTableMessage } from '../../../../components/Table/EmptyPatientTableMessage'
import { Table } from '../../../../components/Table/Table'
import { TableHeadingForUnit } from '../../../../components/Table/heading/TableHeadingForUnit'
import { TableHeader } from '../../../../components/Table/tableHeader/TableHeader'
import { PatientTableError } from '../../../../components/error/ErrorAlert/PatientTableError'
import { useGetPatientLUCertificatesQuery, useGetUserQuery } from '../../../../store/api'
import { useAppSelector } from '../../../../store/hooks'
import { allLuCertificatesColumns } from '../../../../store/slices/luCertificatesTableColumns.selector'
import { LUCertificatesColumn } from '../../../../store/slices/luCertificatesTableColumns.slice'
import { isUserDoctor } from '../../../../utils/isUserDoctor'
import {
  filterHiddenColumns,
  filterTableColumn,
  filterTableColumns,
  isPatientViewColumns,
} from '../../../../components/Table/utils/filterTableColumns'
import { LUCertificatesTableBody } from '../../../LUCertificates/LUCertificatesTableBody'
import { ModifyLUCertificatesTableColumns } from '../../../LUCertificates/ModifyLUCertificatesTableColumns'
import { getLUCertificatesColumnInfo } from '../../../LUCertificates/utils/getLUCertificatesColumnsInfo'

export function PatientLUCertificatesTable() {
  const { data: user } = useGetUserQuery()
  const { encryptedPatientId } = useParams()
  const { showPersonalInformation } = useAppSelector((state) => state.settings)
  const [tableState, setTableState] = useState<{ sortColumn: string; ascending: boolean }>({
    sortColumn: LUCertificatesColumn.Signeringsdatum,
    ascending: false,
  })
  const allColumns = useAppSelector(allLuCertificatesColumns)
  const isDoctor = user ? isUserDoctor(user) : false
  const patientViewColumns = allColumns.filter(({ name }) => !isPatientViewColumns(name))
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
            <ModifyLUCertificatesTableColumns
              columns={filterTableColumn(filteredColumns, LUCertificatesColumn.Visa)}
              preferenceKey="lakarutlatandenTableColumns"
            />
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
