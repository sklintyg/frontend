import { createTableColumnSlice } from '../utils/createTableColumnSlice'

export enum SjukfallColumn {
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

export const sjukfallTableColumnsSlice = createTableColumnSlice('sjukfallTableColumns', Object.values(SjukfallColumn))

export const { enableColumn, disableColumn, toggleAll, moveColumn } = sjukfallTableColumnsSlice.actions
export const { name: sjukfallTableColumnsReducerPath, reducer: sjukfallTableColumnsReducer } = sjukfallTableColumnsSlice
