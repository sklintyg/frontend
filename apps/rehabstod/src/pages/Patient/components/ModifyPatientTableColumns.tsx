import { useEffect } from 'react'
import { ModifyTableColumns } from '../../../components/Table/ModifyTableColumns/ModifyTableColumns'
import { useGetUserQuery } from '../../../store/api'
import { useAppDispatch, useAppSelector, useUpdateUserPreferences } from '../../../store/hooks'
import { allPatientColumns, patientColumnsString } from '../../../store/slices/patientTableColumns.selector'
import { PatientColumn, hideColumn, moveColumn, setColumnDefaults, showColumn } from '../../../store/slices/patientTableColumns.slice'

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
      onVisibleChange={(column, visible) => dispatch(visible ? showColumn(column) : hideColumn(column))}
      onReorder={(target, keys) => {
        dispatch(moveColumn({ target, keys }))
      }}
    />
  )
}
