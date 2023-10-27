import { createTableColumnSlice } from '../utils/createTableColumnSlice'

export enum LUCertificatesColumn {
  Index = '#',
  Personnummer = 'Personnummer',
  Ålder = 'Ålder',
  Namn = 'Namn',
  Kön = 'Kön',
  Intygstyp = 'Intygstyp',
  Diagnos = 'Diagnos/er',
  Signeringsdatum = 'Signeringsdatum',
  Ärenden = 'Ärenden',
  Läkare = 'Läkare',
  Vårdenhet = 'Vårdenhet',
  Vårdgivare = 'Vårdigvare',
  Intyg = 'Intyg',
}

export const {
  slice: luUnitTableColumnsSlice,
  getSelectors: getLUUnitTableColumnsSelectors,
  reducerPath: luUnitTableColumnsReducerPath,
} = createTableColumnSlice('lakarutlatandeUnitTableColumns', Object.values(LUCertificatesColumn))

export const {
  reset: resetLUUnitTableColumns,
  showColumn,
  hideColumn,
  showAllColumns,
  hideAllColumns,
  moveColumn,
  setColumnDefaults,
} = luUnitTableColumnsSlice.actions
