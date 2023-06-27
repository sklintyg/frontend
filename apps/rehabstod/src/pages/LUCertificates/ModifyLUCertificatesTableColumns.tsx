import { useEffect } from 'react'
import { ModifyTableColumns } from '../../components/Table/ModifyTableColumns/ModifyTableColumns'
import { filterTableColumns } from '../../components/Table/utils/filterTableColumns'
import { useGetUserQuery } from '../../store/api'
import { useAppDispatch, useAppSelector, useUpdateUserPreferences } from '../../store/hooks'
import { allLuCertificatesColumns, luCertificatesColumnsString } from '../../store/slices/luCertificatesTableColumns.selector'
import { hideColumn, moveColumn, setColumnDefaults, showColumn } from '../../store/slices/luCertificatesTableColumns.slice'
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

  if (!user) {
    return null
  }

  return (
    <ModifyTableColumns
      onReset={() => dispatch(setColumnDefaults())}
      columns={filterTableColumns(columns, isUserDoctor(user), showPersonalInformation, false)}
      onVisibilityChange={(column, visible) => dispatch(visible ? showColumn(column) : hideColumn(column))}
      onReorder={(target, keys) => {
        dispatch(moveColumn({ target, keys }))
      }}
    />
  )
}
