import { TableColumn } from '../../components/Table/types/TableColumn'

export function columnsToString(columns: TableColumn[]): string {
  return columns.map(({ name, enabled }) => `${name}:${enabled ? '1' : '0'}`).join(';')
}
