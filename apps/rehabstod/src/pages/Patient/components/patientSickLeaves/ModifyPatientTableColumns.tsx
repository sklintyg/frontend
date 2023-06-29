import { useEffect } from 'react'
import { ModifyTableColumns } from '../../../../components/Table/ModifyTableColumns/ModifyTableColumns'
import { filterTableColumns } from '../../../../components/Table/utils/filterTableColumns'
import { useGetSickLeavesFiltersQuery, useGetUserQuery } from '../../../../store/api'
import { useAppDispatch, useAppSelector, useUpdateUserPreferences } from '../../../../store/hooks'
import { allPatientColumns, patientColumnsString } from '../../../../store/slices/patientTableColumns.selector'
import { PatientColumn, hideColumn, moveColumn, setColumnDefaults, showColumn } from '../../../../store/slices/patientTableColumns.slice'
import { isUserDoctor } from '../../../../utils/isUserDoctor'

export function ModifyPatientTableColumns() {
  const dispatch = useAppDispatch()
  const { data: user } = useGetUserQuery()
  const columns = useAppSelector(allPatientColumns)
  const columnString = useAppSelector(patientColumnsString)
  const { updateUserPreferences } = useUpdateUserPreferences()
  const { data: populatedFilters } = useGetSickLeavesFiltersQuery()

  useEffect(() => {
    if (user && columnString !== user.preferences.patientTableColumns) {
      updateUserPreferences({ patientTableColumns: columnString })
    }
  }, [columnString, updateUserPreferences, user])

  if (!user) {
    return null
  }

  return (
    <ModifyTableColumns
      onReset={() => dispatch(setColumnDefaults())}
      columns={filterTableColumns(columns, isUserDoctor(user), false, false, populatedFilters && populatedFilters.srsActivated, [
        PatientColumn.Intyg,
      ])}
      onVisibilityChange={(column, visible) => dispatch(visible ? showColumn(column) : hideColumn(column))}
      onReorder={(target, keys) => {
        dispatch(moveColumn({ target, keys }))
      }}
    />
  )
}
