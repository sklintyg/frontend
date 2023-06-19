import { useEffect } from 'react'
import { ModifyTableColumns } from '../../../components/Table/ModifyTableColumns'
import { useGetPopulatedFiltersQuery, useGetUserQuery } from '../../../store/api'
import { useAppDispatch, useAppSelector, useUpdateUserPreferences } from '../../../store/hooks'
import { allSickLeaveColumns, sickLeaveColumnsString } from '../../../store/slices/sickLeaveTableColumns.selector'
import { hideColumn, moveColumn, setColumnDefaults, showAllColumns, showColumn } from '../../../store/slices/sickLeaveTableColumns.slice'
import { filterTableColumns } from '../../../components/Table/utils/filterTableColumns'
import { isUserDoctor } from '../../../utils/isUserDoctor'

export function ModifySicknessTableColumns() {
  const dispatch = useAppDispatch()
  const { data: user } = useGetUserQuery()
  const { data: populatedFilters } = useGetPopulatedFiltersQuery()
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
