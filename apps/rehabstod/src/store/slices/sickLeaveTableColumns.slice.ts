/* eslint-disable import/no-default-export */
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
  Ärenden = 'Ärenden',
  Risk = 'Risk',
  Läkare = 'Läkare',
}

export const { sjukfallTableColumnsSlice, sjukfallTableColumnsReducerPath, getSjukfallTableColumnsSelector } = createTableColumnSlice(
  'sjukfallTableColumns',
  Object.values(SickLeaveColumn)
)

export const {
  reset: resetSjukfallTableColumns,
  showColumn,
  hideColumn,
  showAllColumns,
  hideAllColumns,
  moveColumn,
  setColumnDefaults,
} = sjukfallTableColumnsSlice.actions
