import { createTableColumnSlice } from '../utils/createTableColumnSlice'

export enum SickLeaveColumn {
  Personnummer = 'Personnummer',
  Ålder = 'Ålder',
  Namn = 'Namn',
  Kön = 'Kön',
  Diagnos = 'Diagnos/er',
  Sysselsättning = 'Sysselsättning',
  Slutdatum = 'Slutdatum',
  Startdatum = 'Startdatum',
  Längd = 'Längd',
  Intyg = 'Intyg',
  Grad = 'Grad',
  Läkare = 'Läkare',
}

export const { slice: sickLeaveTableColumnsSlice, getSelectors: getSjukfallTableColumnsSelectors } = createTableColumnSlice(
  'sjukfallTableColumns',
  Object.values(SickLeaveColumn)
)

export const {
  reset: resetSickLeaveTableColumns,
  showColumn,
  hideColumn,
  showAllColumns,
  hideAllColumns,
  moveColumn,
} = sickLeaveTableColumnsSlice.actions
export const { name: sickLeaveTableColumnsReducerPath, reducer: sickLeaveTableColumnsReducer } = sickLeaveTableColumnsSlice
