import { TableColumn } from '../schemas/tableSchema'

export function columnsToString(columns: TableColumn[]) {
  return columns.map(({ name, visible: checked }) => `${name}:${checked ? '1' : '0'}`).join(';')
}
