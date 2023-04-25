import { TableColumn } from '../../components/Table/types/TableColumn'

export function getTableColumns(preferences: string | undefined, columns: string[]): TableColumn[] {
  const savedColumns = (preferences?.split(';').filter(Boolean) ?? []).map((col) => {
    const [name, enabled] = col.split(':')
    return { name, enabled: enabled === '1' }
  })

  return columns.map((column) => ({
    name: column,
    enabled: true,
    ...savedColumns.find(({ name }) => name === column),
  }))
}
