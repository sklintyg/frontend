import { createTableColumnSlice } from '../utils/createTableColumnSlice'

export enum LUCertificatesColumn {
  Index = '#',
  Personnummer = 'Personnummer',
  Ålder = 'Ålder',
  Namn = 'Namn',
  Kön = 'Kön',
  Intyg = 'Intyg',
  Diagnos = 'Diagnos/er',
  Signeringsdatum = 'Signeringsdatum',
  Ärenden = 'Ärenden',
  Läkare = 'Läkare',
  Vårdenhet = 'Vårdenhet',
  Vårdgivare = 'Vårdigvare',
  Visa = 'Visa',
}

export const {
  lakarutlatandeUnitTableColumnsSlice: luUnitTableColumnsSlice,
  getLakarutlatandeUnitTableColumnsSelectors: getLUUnitTableColumnsSelectors,
  lakarutlatandeUnitTableColumnsReducerPath: luUnitTableColumnsReducerPath,
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
