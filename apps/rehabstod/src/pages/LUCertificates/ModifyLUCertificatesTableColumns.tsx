import { useEffect } from 'react'
import { ModifyTableColumns } from '../../components/Table/ModifyTableColumns/ModifyTableColumns'
import { TableColumn } from '../../schemas/tableSchema'
import { useGetUserQuery } from '../../store/api'
import { useAppDispatch, useAppSelector, useUpdateUserPreferences } from '../../store/hooks'
import { lakarutlatandeUnitTableColumnsString } from '../../store/slices/lakarutlatandeUnitTableColumns.selector'
import { hideColumn, moveColumn, setColumnDefaults, showColumn } from '../../store/slices/lakarutlatandeUnitTableColumns.slice'

export function ModifyLUCertificatesTableColumns({ columns }: { columns: TableColumn[] }) {
  const dispatch = useAppDispatch()
  const { data: user } = useGetUserQuery()
  const columnString = useAppSelector(lakarutlatandeUnitTableColumnsString)
  const { updateUserPreferences } = useUpdateUserPreferences()

  useEffect(() => {
    if (user && columnString !== user.preferences.lakarutlatandeUnitTableColumns) {
      updateUserPreferences({ lakarutlatandeUnitTableColumns: columnString })
    }
  }, [columnString, updateUserPreferences, user])

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
