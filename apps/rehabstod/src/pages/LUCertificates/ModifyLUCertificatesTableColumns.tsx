import { useEffect } from 'react'
import { useAppDispatch, useAppSelector, useUpdateUserPreferences } from '../../store/hooks'
import { useGetUserQuery } from '../../store/api'
import { luCertificatesColumnsString } from '../../store/slices/luCertificatesTableColumns.selector'
import { ModifyTableColumns } from '../../components/Table/ModifyTableColumns'
import { hideColumn, moveColumn, setColumnDefaults, showAllColumns, showColumn } from '../../store/slices/luCertificatesTableColumns.slice'
import { TableColumn } from '../../schemas/tableSchema'

export function ModifyLUCertificatesTableColumns({ columns, preferenceKey }: { columns: TableColumn[]; preferenceKey: string }) {
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
