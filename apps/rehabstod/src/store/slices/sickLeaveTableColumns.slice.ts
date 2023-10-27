/* eslint-disable import/no-default-export */
import { createTableColumnSlice } from '../utils/createTableColumnSlice'

export enum SickLeaveColumn {
  Index = '#',
  Status = 'Status',
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
  Ärenden = 'Ärenden',
  Risk = 'Risk',
  Läkare = 'Läkare',
}

export const {
  slice: sickLeaveTableColumnsSlice,
  getSelectors: getSickLeaveTableColumnsSelectors,
  reducerPath: sickLeaveTableColumnsReducerPath,
} = createTableColumnSlice('sjukfallTableColumns', Object.values(SickLeaveColumn))

export const {
  reset: resetSickLeaveTableColumns,
  showColumn,
  hideColumn,
  showAllColumns,
  hideAllColumns,
  moveColumn,
  setColumnDefaults,
} = sickLeaveTableColumnsSlice.actions
