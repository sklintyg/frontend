import { createTableColumnSlice } from '../utils/createTableColumnSlice'
import { LUCertificatesColumn } from './luUnitTableColumns.slice'

export const {
  lakarutlatandenTableColumnsSlice: luTableColumnsSlice,
  lakarutlatandenTableColumnsReducerPath: luTableColumnsReducerPath,
  getLakarutlatandenTableColumnsSelectors: getLUTableColumnsSelectors,
} = createTableColumnSlice('lakarutlatandenTableColumns', Object.values(LUCertificatesColumn))

export const {
  reset: resetLUTableColumns,
  showColumn,
  hideColumn,
  showAllColumns,
  hideAllColumns,
  moveColumn,
  setColumnDefaults,
} = luTableColumnsSlice.actions
