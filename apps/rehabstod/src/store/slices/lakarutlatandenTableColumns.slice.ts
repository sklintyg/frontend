import { createTableColumnSlice } from '../utils/createTableColumnSlice'
import { LUCertificatesColumn } from './lakarutlatandeUnitTableColumns.slice'

export const { lakarutlatandenTableColumnsSlice, lakarutlatandenTableColumnsReducerPath, getLakarutlatandenTableColumnsSelector } =
  createTableColumnSlice('lakarutlatandenTableColumns', Object.values(LUCertificatesColumn))

export const {
  reset: resetLakarutlatandenTableColumns,
  showColumn,
  hideColumn,
  showAllColumns,
  hideAllColumns,
  moveColumn,
  setColumnDefaults,
} = lakarutlatandenTableColumnsSlice.actions
