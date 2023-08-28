import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Table } from '../../../../components/Table/Table'
import { TableHeader } from '../../../../components/Table/tableHeader/TableHeader'
import { filterHiddenColumns, filterTableColumns } from '../../../../components/Table/utils/filterTableColumns'
import { PatientTableError } from '../../../../components/error/ErrorAlert/PatientTableError'
import { useGetUserQuery } from '../../../../store/api'
import { useAppSelector } from '../../../../store/hooks'
import { useGetAGCertificatesForPatientQuery } from '../../../../store/sickLeaveApi'
import { allPatientColumns } from '../../../../store/slices/patientTableColumns.selector'
import { PatientColumn } from '../../../../store/slices/patientTableColumns.slice'
import { isUserDoctor } from '../../../../utils/isUserDoctor'
import { EmptyPatientTableMessage } from '../EmptyPatientTableMessage/EmptyPatientTableMessage'
import { PatientAccordion } from '../PatientAccordion/PatientAccordion'
import { AGCertificatesTableBody } from './AGCertificatesTableBody'
import { getAGCertificatesColumnInfo } from './getAGCertificatesColumnsInfo'

export function PatientAGCertificatesTable() {
  const { data: user } = useGetUserQuery()
  const { encryptedPatientId } = useParams()
  const { data: agCertificatesInfo, error: getAGCertificatesError } = useGetAGCertificatesForPatientQuery({
    encryptedPatientId: encryptedPatientId || '',
  })

  const [tableState, setTableState] = useState<{ sortColumn: string; ascending: boolean }>({
    sortColumn: PatientColumn.Num,
    ascending: false,
  })
  const { showPersonalInformation } = useAppSelector((state) => state.settings)

  const isDoctor = user ? isUserDoctor(user) : false

  const allColumns = useAppSelector(allPatientColumns)
  const filteredColumns = filterTableColumns(allColumns, isDoctor, showPersonalInformation, false, undefined, undefined)
  const visibleColumns = filterHiddenColumns(filteredColumns)

  return (
    <>
      <h2 className="ids-heading-3">Intyg till arbetsgivaren</h2>
      <PatientAccordion
        title="Intyg till arbetsgivaren för patienten - räknas inte in i patientens uppskattade dag i sjukfallet."
        open={false}
      >
        {getAGCertificatesError ? (
          <PatientTableError error={getAGCertificatesError} />
        ) : (
          <Table
            header={<TableHeader columns={visibleColumns.map((column) => getAGCertificatesColumnInfo(column.name))} />}
            sortColumn={tableState.sortColumn}
            ascending={tableState.ascending}
            onSortChange={setTableState}
          >
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
