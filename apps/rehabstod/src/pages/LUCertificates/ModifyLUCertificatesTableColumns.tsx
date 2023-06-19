import { useEffect } from 'react'
import { useAppDispatch, useAppSelector, useUpdateUserPreferences } from '../../store/hooks'
import { useGetUserQuery } from '../../store/api'
import { allLuCertificatesColumns, luCertificatesColumnsString } from '../../store/slices/luCertificatesTableColumns.selector'
import { ModifyTableColumns } from '../../components/Table/ModifyTableColumns'
import { hideColumn, moveColumn, setColumnDefaults, showAllColumns, showColumn } from '../../store/slices/luCertificatesTableColumns.slice'
import { filterTableColumns } from '../../components/Table/utils/filterTableColumns'
import { isUserDoctor } from '../../utils/isUserDoctor'

export function ModifyLUCertificatesTableColumns() {
  const dispatch = useAppDispatch()
  const { data: user } = useGetUserQuery()
  const columns = useAppSelector(allLuCertificatesColumns)
  const columnString = useAppSelector(luCertificatesColumnsString)
  const { updateUserPreferences } = useUpdateUserPreferences()
  const { showPersonalInformation } = useAppSelector((state) => state.settings)

  useEffect(() => {
    if (user && columnString !== user.preferences.lakarutlatandenTableColumns) {
      updateUserPreferences({ lakarutlatandenTableColumns: columnString })
    }
  }, [columnString, updateUserPreferences, user])

  return (
    <ModifyTableColumns
      onReset={() => dispatch(setColumnDefaults())}
      columns={filterTableColumns(columns, isUserDoctor(user), showPersonalInformation, false)}
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
