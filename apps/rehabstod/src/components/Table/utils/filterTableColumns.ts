import { TableColumn } from '../../../schemas/tableSchema'

export const filterTableColumns = (
  columns: TableColumn[],
  isDoctor?: boolean,
  showPersonalInformation?: boolean,
  onlyVisible?: boolean,
  srsActivated?: boolean,
  excludedColumns?: string[],
  isPatientView?: boolean
) =>
  columns
    .filter(({ visible }) => visible || !onlyVisible)
    .filter(({ name }) => !(showPersonalInformation === false && (name === 'Namn' || name === 'Personnummer')))
    .filter(({ name }) => !(isDoctor && name === 'Läkare'))
    .filter(({ name }) => !(!srsActivated && name === 'Risk'))
    .filter(({ name }) => !(isPatientView && (name === 'Namn' || name === 'Personnummer' || name === 'Kön' || name === 'Ålder')))
    .filter(({ name }) => !(excludedColumns && excludedColumns.includes(name)))

export const filterHiddenColumns = (columns: TableColumn[]) => columns.filter(({ visible }) => visible)

export const filterTableColumn = (columns: TableColumn[], columnToFilter: string) =>
  columns.filter(({ name }) => !(name === columnToFilter))
