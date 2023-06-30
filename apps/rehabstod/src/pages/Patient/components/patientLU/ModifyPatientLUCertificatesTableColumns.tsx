import { useEffect } from 'react'
import { ModifyTableColumns } from '../../../../components/Table/ModifyTableColumns/ModifyTableColumns'
import { TableColumn } from '../../../../schemas/tableSchema'
import { useGetUserQuery } from '../../../../store/api'
import { useAppDispatch, useAppSelector, useUpdateUserPreferences } from '../../../../store/hooks'
import { lakarutlatandenTableColumnsString } from '../../../../store/slices/LUTableColumns.selector'
import { hideColumn, moveColumn, setColumnDefaults, showColumn } from '../../../../store/slices/LUTableColumns.slice'

export function ModifyPatientLUCertificatesTableColumns({ columns }: { columns: TableColumn[] }) {
  const dispatch = useAppDispatch()
  const { data: user } = useGetUserQuery()
  const columnString = useAppSelector(lakarutlatandenTableColumnsString)
  const { updateUserPreferences } = useUpdateUserPreferences()

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
      columns={columns}
      onVisibilityChange={(column, visible) => dispatch(visible ? showColumn(column) : hideColumn(column))}
      onReorder={(target, keys) => {
        dispatch(moveColumn({ target, keys }))
      }}
    />
  )
}
