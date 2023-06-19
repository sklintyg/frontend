import { createTableColumnSlice } from '../utils/createTableColumnSlice'

export enum LUCertificatesColumn {
  Personnummer = 'Personnummer',
  Ålder = 'Ålder',
  Namn = 'Namn',
  Kön = 'Kön',
  Intyg = 'Intyg',
  Signeringsdatum = 'Signeringsdatum',
  Diagnos = 'Diagnos/er',
  Ärenden = 'Ärenden',
  Läkare = 'Läkare',
}

export const { slice: luCertificatesColumnsSlice, getSelectors: getLuCertificatesColumnsSelectors } = createTableColumnSlice(
  'lakarutlatandeUnitTableColumns',
  Object.values(LUCertificatesColumn)
)

export const {
  reset: resetLuCertificatesColumnSlice,
  showColumn,
  hideColumn,
  showAllColumns,
  hideAllColumns,
  moveColumn,
  setColumnDefaults,
} = luCertificatesColumnsSlice.actions
export const { name: luCertificatesColumnsReducerPath, reducer: luCertificatesColumnsReducer } = luCertificatesColumnsSlice
