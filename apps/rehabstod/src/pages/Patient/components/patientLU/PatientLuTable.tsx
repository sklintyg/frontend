import { useState } from 'react'
import { TableHeader } from '../../../../components/Table/tableHeader/TableHeader'
import { getLUCertificatesColumnInfo } from '../../../LUCertificates/utils/getLUCertificatesColumnsInfo'
import { LUCertificatesTableBody } from '../../../LUCertificates/LUCertificatesTableBody'
import { Table } from '../../../../components/Table/Table'
import { LUCertificatesColumn } from '../../../../store/slices/luCertificatesTableColumns.slice'
import { useAppSelector } from '../../../../store/hooks'
import { allLuCertificatesColumns } from '../../../../store/slices/luCertificatesTableColumns.selector'
import { useGetLUCertificatesForPatientQuery, useGetUserQuery } from '../../../../store/api'
import { isUserDoctor } from '../../../../utils/isUserDoctor'
import { filterHiddenColumns, filterTableColumns } from '../../../../components/Table/utils/filterTableColumns'
import { TableHeadingForUnit } from '../../../../components/Table/heading/TableHeadingForUnit'
import { ModifyLUCertificatesTableColumns } from '../../../LUCertificates/ModifyLUCertificatesTableColumns'

export function PatientLuTable() {
  const { data: user } = useGetUserQuery()
  const { showPersonalInformation } = useAppSelector((state) => state.settings)
  const [tableState, setTableState] = useState<{ sortColumn: string; ascending: boolean }>({
    sortColumn: LUCertificatesColumn.Signeringsdatum,
    ascending: false,
  })
  const allColumns = useAppSelector(allLuCertificatesColumns)
  const isDoctor = user ? isUserDoctor(user) : false
  const filteredColumns = filterTableColumns(allColumns, isDoctor, showPersonalInformation, false, undefined, [
    LUCertificatesColumn.Namn,
    LUCertificatesColumn.Kön,
    LUCertificatesColumn.Personnummer,
    LUCertificatesColumn.Ålder,
  ])
  const visibleColumns = filterHiddenColumns(filteredColumns)
  const { data: luCertificatesInfo } = useGetLUCertificatesForPatientQuery({ personId: '191212121212' })

  return (
    <>
      <div className="flex justify-between">
        <TableHeadingForUnit tableName="Patientens läkarutlåtanden" hideUserSpecifics hideDivider user={user} />
        <div className="w-96">
          <ModifyLUCertificatesTableColumns
            columns={filterTableColumns(filteredColumns, [LUCertificatesColumn.Visa])}
            preferenceKey="lakarutlatandenTableColumns"
          />
        </div>
      </div>
      <Table sortColumn={tableState.sortColumn} onSortChange={setTableState} ascending={tableState.ascending}>
        <TableHeader columns={visibleColumns.map((column) => getLUCertificatesColumnInfo(column.name))} />
        <LUCertificatesTableBody content={luCertificatesInfo ? luCertificatesInfo.certificates : []} columns={visibleColumns} />
      </Table>
    </>
  )
}
