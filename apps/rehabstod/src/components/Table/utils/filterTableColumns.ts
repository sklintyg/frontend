import { TableColumn } from '../../../schemas/tableSchema'

export const filterTableColumns = (
  columns: TableColumn[],
  isDoctor?: boolean,
  showPersonalInformation?: boolean,
  onlyVisible?: boolean,
  srsActivated?: boolean,
  excludedColumns?: string[]
) =>
  columns
    .filter(({ visible }) => visible || !onlyVisible)
    .filter(({ name }) => !(showPersonalInformation === false && (name === 'Namn' || name === 'Personnummer')))
    .filter(({ name }) => !(isDoctor && name === 'Läkare'))
    .filter(({ name }) => !(!srsActivated && name === 'Risk'))
    .filter(({ name }) => !(excludedColumns && excludedColumns.includes(name)))
