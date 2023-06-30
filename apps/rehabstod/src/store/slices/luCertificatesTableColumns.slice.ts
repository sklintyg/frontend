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
