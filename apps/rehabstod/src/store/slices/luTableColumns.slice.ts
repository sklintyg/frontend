import { LUCertificatesColumn } from './luUnitTableColumns.slice'
import { createTableColumnSlice } from '../utils/createTableColumnSlice'

export const {
  slice: luTableColumnsSlice,
  getSelectors: getLUTableColumnsSelectors,
  reducerPath: luTableColumnsReducerPath,
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
