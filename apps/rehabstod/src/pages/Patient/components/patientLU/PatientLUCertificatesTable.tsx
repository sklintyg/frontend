import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Table } from '../../../../components/Table/Table'
import { TableHeadingForUnit } from '../../../../components/Table/heading/TableHeadingForUnit'
import { TableHeader } from '../../../../components/Table/tableHeader/TableHeader'
import {
  filterHiddenColumns,
  filterTableColumn,
  filterTableColumns,
  isPatientViewColumn,
} from '../../../../components/Table/utils/filterTableColumns'
import { PatientTableError } from '../../../../components/error/ErrorAlert/PatientTableError'
import { useGetUserQuery } from '../../../../store/api'
import { useAppSelector } from '../../../../store/hooks'
import { useGetPatientLUCertificatesQuery } from '../../../../store/luApi'
import { allLUTableColumns } from '../../../../store/slices/luTableColumns.selector'
import { LUCertificatesColumn } from '../../../../store/slices/luUnitTableColumns.slice'
import { isUserDoctor } from '../../../../utils/isUserDoctor'
import { LUCertificatesTableBody } from '../../../LUCertificates/components/LUCertificatesTableBody'
import { getLUCertificatesColumnInfo } from '../../../LUCertificates/utils/getLUCertificatesColumnsInfo'
import { EmptyPatientTableMessage } from '../EmptyPatientTableMessage/EmptyPatientTableMessage'
import { ModifyPatientLUCertificatesTableColumns } from './ModifyPatientLUCertificatesTableColumns'

export function PatientLUCertificatesTable() {
  const { data: user } = useGetUserQuery()
  const { encryptedPatientId } = useParams()
  const showPersonalInformation = useAppSelector((state) => state.settings.showPersonalInformation)
  const [tableState, setTableState] = useState<{ sortColumn: string; ascending: boolean }>({
    sortColumn: LUCertificatesColumn.Signeringsdatum,
    ascending: false,
  })
  const allColumns = useAppSelector(allLUTableColumns)
  const isDoctor = user ? isUserDoctor(user) : false
  const patientViewColumns = allColumns.filter(({ name }) => !isPatientViewColumn(name))
  const filteredColumns = filterTableColumns(patientViewColumns, isDoctor, showPersonalInformation, false)
  const visibleColumns = filterHiddenColumns(filteredColumns)
  const { data: luCertificatesInfo, error: getLuCertificatesError } = useGetPatientLUCertificatesQuery({
    encryptedPatientId: encryptedPatientId || '',
  })

  return (
    <>
      <TableHeadingForUnit tableName="Patientens läkarutlåtanden" hideUserSpecifics hideDivider user={user}>
        {!getLuCertificatesError && (
          <div className="lg:w-96">
            <ModifyPatientLUCertificatesTableColumns columns={filterTableColumn(filteredColumns, LUCertificatesColumn.Intyg)} />
          </div>
        )}
      </TableHeadingForUnit>
      {getLuCertificatesError ? (
        <PatientTableError error={getLuCertificatesError} />
      ) : (
        <Table
          header={<TableHeader columns={visibleColumns.map((column) => getLUCertificatesColumnInfo(column.name))} />}
          sortColumn={tableState.sortColumn}
          onSortChange={setTableState}
          ascending={tableState.ascending}
        >
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
