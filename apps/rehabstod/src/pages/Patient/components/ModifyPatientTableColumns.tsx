import { useEffect } from 'react'
import { ModifyTableColumns } from '../../../components/Table/ModifyTableColumns'
import { useGetUserQuery } from '../../../store/api'
import { useAppDispatch, useAppSelector, useUpdateUserPreferences } from '../../../store/hooks'
import { allPatientColumns, patientColumnsString } from '../../../store/slices/patientTableColumns.selector'
import {
  hideColumn,
  moveColumn,
  PatientColumn,
  setColumnDefaults,
  showAllColumns,
  showColumn,
} from '../../../store/slices/patientTableColumns.slice'

export function ModifyPatientTableColumns() {
  const dispatch = useAppDispatch()
  const { data: user } = useGetUserQuery()
  const columns = useAppSelector(allPatientColumns)
  const columnString = useAppSelector(patientColumnsString)
  const { updateUserPreferences } = useUpdateUserPreferences()

  useEffect(() => {
    if (user && columnString !== user.preferences.patientTableColumns) {
      updateUserPreferences({ patientTableColumns: columnString })
    }
  }, [columnString, updateUserPreferences, user])

  return (
    <ModifyTableColumns
      onReset={() => dispatch(setColumnDefaults())}
      columns={columns.filter(({ name }) => name !== PatientColumn.Intyg)}
      onChecked={(column, visible) => dispatch(visible ? showColumn(column) : hideColumn(column))}
      onMove={(column, direction) => {
        dispatch(moveColumn({ column, direction }))
      }}
      onShowAll={() => {
        dispatch(showAllColumns())
      }}
    />
  )
}
