import { useEffect } from 'react'
import { ModifyTableColumns } from '../../../components/Table/ModifyTableColumns/ModifyTableColumns'
import { filterTableColumns } from '../../../components/Table/utils/filterTableColumns'
import { useGetUserQuery } from '../../../store/api'
import { useAppDispatch, useAppSelector, useUpdateUserPreferences } from '../../../store/hooks'
import { useGetSickLeavesFiltersQuery } from '../../../store/sickLeaveApi'
import { allSickLeaveColumns, sickLeaveColumnsString } from '../../../store/slices/sickLeaveTableColumns.selector'
import { hideColumn, moveColumn, setColumnDefaults, showColumn } from '../../../store/slices/sickLeaveTableColumns.slice'
import { isUserDoctor } from '../../../utils/isUserDoctor'

export function ModifySicknessTableColumns() {
  const dispatch = useAppDispatch()
  const { data: user } = useGetUserQuery()
  const { data: populatedFilters } = useGetSickLeavesFiltersQuery()
  const columns = useAppSelector(allSickLeaveColumns)
  const columnString = useAppSelector(sickLeaveColumnsString)
  const { updateUserPreferences } = useUpdateUserPreferences()
  const { showPersonalInformation } = useAppSelector((state) => state.settings)

  useEffect(() => {
    if (user && columnString !== user.preferences.sjukfallTableColumns) {
      updateUserPreferences({ sjukfallTableColumns: columnString })
    }
  }, [columnString, updateUserPreferences, user])

  if (!user) {
    return null
  }

  return (
    <ModifyTableColumns
      onReset={() => dispatch(setColumnDefaults())}
      columns={filterTableColumns(
        columns,
        isUserDoctor(user),
        showPersonalInformation,
        false,
        populatedFilters && populatedFilters.srsActivated
      )}
      onVisibilityChange={(column, visible) => dispatch(visible ? showColumn(column) : hideColumn(column))}
      onReorder={(target, keys) => dispatch(moveColumn({ target, keys }))}
    />
  )
}
