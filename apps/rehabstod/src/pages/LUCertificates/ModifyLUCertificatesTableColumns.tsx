import { useEffect } from 'react'
import { ModifyTableColumns } from '../../components/Table/ModifyTableColumns/ModifyTableColumns'
import { UserPreferencesTableSettings } from '../../schemas'
import { TableColumn } from '../../schemas/tableSchema'
import { useGetUserQuery } from '../../store/api'
import { useAppDispatch, useAppSelector, useUpdateUserPreferences } from '../../store/hooks'
import { luCertificatesColumnsString } from '../../store/slices/luCertificatesTableColumns.selector'
import { hideColumn, moveColumn, setColumnDefaults, showColumn } from '../../store/slices/luCertificatesTableColumns.slice'

export function ModifyLUCertificatesTableColumns({
  columns,
  preferenceKey,
}: {
  columns: TableColumn[]
  preferenceKey: UserPreferencesTableSettings
}) {
  const dispatch = useAppDispatch()
  const { data: user } = useGetUserQuery()
  const columnString = useAppSelector(luCertificatesColumnsString)
  const { updateUserPreferences } = useUpdateUserPreferences()

  useEffect(() => {
    if (user && columnString !== user.preferences[preferenceKey]) {
      updateUserPreferences({ [preferenceKey]: columnString })
    }
  }, [columnString, updateUserPreferences, user, preferenceKey])

  if (!user) {
    return null
  }

  return (
    <ModifyTableColumns
      onReset={() => dispatch(setColumnDefaults())}
      columns={columns}
      onVisibilityChange={(column, visible) => dispatch(visible ? showColumn(column) : hideColumn(column))}
      onReorder={(target, keys) => {
        dispatch(moveColumn({ target, keys }))
      }}
    />
  )
}
