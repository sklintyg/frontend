import { TableColumn } from '../../../schemas/tableSchema'

export const isPatientViewColumns = (name: string) => name === 'Namn' || name === 'Personnummer' || name === 'Kön' || name === 'Ålder'

export const isPersonalInformationColumn = (name: string) => name === 'Namn' || name === 'Personnummer'

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
    .filter(({ name }) => !(!showPersonalInformation && isPersonalInformationColumn(name)))
    .filter(({ name }) => !(isDoctor && name === 'Läkare'))
    .filter(({ name }) => !(!srsActivated && name === 'Risk'))
    .filter(({ name }) => !(excludedColumns && excludedColumns.includes(name)))

export const filterHiddenColumns = (columns: TableColumn[]) => columns.filter(({ visible }) => visible)

export const filterTableColumn = (columns: TableColumn[], columnToFilter: string) =>
  columns.filter(({ name }) => !(name === columnToFilter))
