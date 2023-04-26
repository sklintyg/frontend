import { useEffect } from 'react'
import { ModifyTableColumns } from '../../../components/Table/ModifyTableColumns'
import { useGetUserQuery, useUpdateTableColumnsMutation } from '../../../store/api'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { allPatientColumns, patientColumnsString } from '../../../store/slices/patientTableColumnsSelectors'
import { checkAllColumns, hideColumn, PatientColumn, showColumn } from '../../../store/slices/patientTableColumnsSlice'

export function PatientModifyTableColumns() {
  const dispatch = useAppDispatch()
  const { data: user } = useGetUserQuery()
  const columns = useAppSelector(allPatientColumns)
  const columnString = useAppSelector(patientColumnsString)
  const [updateTableColumns] = useUpdateTableColumnsMutation()

  useEffect(() => {
    if (user && columnString !== user?.preferences.patientTableColumns) {
      updateTableColumns({ id: 'patientTableColumns', columns: columnString })
    }
  }, [columnString, updateTableColumns, user])

  return (
    <ModifyTableColumns
      columns={columns.filter(({ name }) => name !== PatientColumn.Intyg)}
      onChecked={(column, visible) => dispatch(visible ? showColumn(column) : hideColumn(column))}
      onShowAll={() => {
        dispatch(checkAllColumns())
      }}
    />
  )
}
