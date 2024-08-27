import { useEffect } from 'react'
import { ModifyTableColumns } from '../../../../components/Table/ModifyTableColumns/ModifyTableColumns'
import type { TableColumn } from '../../../../schemas/tableSchema'
import { useGetUserQuery } from '../../../../store/api'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { useUpdateUserPreferences } from '../../../../store/hooks/useUpdateUserPreferences'
import { luTableColumnsString } from '../../../../store/slices/luTableColumns.selector'
import { hideColumn, moveColumn, setColumnDefaults, showColumn } from '../../../../store/slices/luTableColumns.slice'

export function ModifyPatientLUCertificatesTableColumns({ columns }: { columns: TableColumn[] }) {
  const dispatch = useAppDispatch()
  const { data: user } = useGetUserQuery()
  const columnString = useAppSelector(luTableColumnsString)
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
