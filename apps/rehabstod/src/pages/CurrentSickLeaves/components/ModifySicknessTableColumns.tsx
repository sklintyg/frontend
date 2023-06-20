import { useEffect } from 'react'
import { ModifyTableColumns } from '../../../components/Table/ModifyTableColumns/ModifyTableColumns'
import { useGetUserQuery } from '../../../store/api'
import { useAppDispatch, useAppSelector, useUpdateUserPreferences } from '../../../store/hooks'
import { allSickLeaveColumns, sickLeaveColumnsString } from '../../../store/slices/sickLeaveTableColumns.selector'
import { hideColumn, moveColumn, setColumnDefaults, showAllColumns, showColumn } from '../../../store/slices/sickLeaveTableColumns.slice'

export function ModifySicknessTableColumns() {
  const dispatch = useAppDispatch()
  const { data: user } = useGetUserQuery()
  const columns = useAppSelector(allSickLeaveColumns)
  const columnString = useAppSelector(sickLeaveColumnsString)
  const { updateUserPreferences } = useUpdateUserPreferences()

  useEffect(() => {
    if (user && columnString !== user.preferences.sjukfallTableColumns) {
      updateUserPreferences({ sjukfallTableColumns: columnString })
    }
  }, [columnString, updateUserPreferences, user])

  return (
    <ModifyTableColumns
      onReset={() => dispatch(setColumnDefaults())}
      columns={columns}
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
