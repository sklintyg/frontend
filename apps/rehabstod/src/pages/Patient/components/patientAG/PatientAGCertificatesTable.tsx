import { useId, useState } from 'react'
import { Table } from '../../../../components/Table/Table'
import { PatientColumn } from '../../../../store/slices/patientTableColumns.slice'
import { useAppSelector } from '../../../../store/hooks'
import { allPatientColumns } from '../../../../store/slices/patientTableColumns.selector'
import { isUserDoctor } from '../../../../utils/isUserDoctor'
import { filterHiddenColumns, filterTableColumns } from '../../../../components/Table/utils/filterTableColumns'
import { TableHeader } from '../../../../components/Table/tableHeader/TableHeader'
import { useGetAGCertificatesForPatientQuery, useGetUserQuery } from '../../../../store/api'
import { getAGCertificatesColumnInfo } from './getAGCertificatesColumnsInfo'
import { AGCertificatesTableBody } from './AGCertificatesTableBody'
import { PatientTableError } from '../../../../components/error/ErrorAlert/PatientTableError'
import { EmptyPatientTableMessage } from '../../../../components/Table/EmptyPatientTableMessage'
import { PatientAccordion } from '../../../../components/PatientAccordion/PatientAccordion'
import { FixedTableHeader } from '../../../CurrentSickLeaves/components/FixedTableHeader'

export function PatientAGCertificatesTable() {
  const { data: user } = useGetUserQuery()
  const { data: agCertificatesInfo, error: getAGCertificatesError } = useGetAGCertificatesForPatientQuery({ personId: '191212121212' })

  const [tableState, setTableState] = useState<{ sortColumn: string; ascending: boolean }>({
    sortColumn: PatientColumn.Num,
    ascending: false,
  })
  const { showPersonalInformation } = useAppSelector((state) => state.settings)

  const isDoctor = user ? isUserDoctor(user) : false

  const allColumns = useAppSelector(allPatientColumns)
  const filteredColumns = filterTableColumns(allColumns, isDoctor, showPersonalInformation, false, undefined, undefined)
  const visibleColumns = filterHiddenColumns(filteredColumns)
  const contentDivId = useId()
  const scrollDivId = useId()

  return (
    <>
      <h2 className="ids-heading-3">Intyg till arbetsgivaren</h2>
      <PatientAccordion title="Intyg till arbetsgivaren för patienten - räknas inte in i patientens uppskattade dag i sjukfallet.">
        {getAGCertificatesError ? (
          <PatientTableError error={getAGCertificatesError} />
        ) : (
          <Table
            sortColumn={tableState.sortColumn}
            ascending={tableState.ascending}
            onSortChange={setTableState}
            contentDivId={contentDivId}
            scrollDivId={scrollDivId}
          >
            <FixedTableHeader bottomMargin={90} contentDivId={contentDivId} scrollDivId={scrollDivId} topMargin>
              <TableHeader columns={visibleColumns.map((column) => getAGCertificatesColumnInfo(column.name))} />
            </FixedTableHeader>
            {!agCertificatesInfo || agCertificatesInfo.certificates.length === 0 ? (
              <tbody>
                <EmptyPatientTableMessage tableName="intyg till arbetsgivaren" tableLength={visibleColumns.length} user={user} />
              </tbody>
            ) : (
              <AGCertificatesTableBody columns={visibleColumns} content={agCertificatesInfo.certificates} />
            )}
          </Table>
        )}
      </PatientAccordion>
    </>
  )
}
