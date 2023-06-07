import { createTableColumnSlice } from '../utils/createTableColumnSlice'

export enum SickLeaveColumn {
  RekoStatus = 'REKO-status',
  Personnummer = 'Personnummer',
  Ålder = 'Ålder',
  Namn = 'Namn',
  Kön = 'Kön',
  Diagnos = 'Diagnos/er',
  Sysselsättning = 'Sysselsättning',
  Startdatum = 'Startdatum',
  Slutdatum = 'Slutdatum',
  Längd = 'Längd',
  Intyg = 'Intyg',
  Grad = 'Grad',
  Risk = 'Risk',
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
  setColumnDefaults,
} = sickLeaveTableColumnsSlice.actions
export const { name: sickLeaveTableColumnsReducerPath, reducer: sickLeaveTableColumnsReducer } = sickLeaveTableColumnsSlice
