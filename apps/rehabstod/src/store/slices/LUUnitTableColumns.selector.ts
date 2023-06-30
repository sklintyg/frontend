import { RootState } from '../store'
import { getLUUnitTableColumnsSelector } from './luUnitTableColumns.slice'

export const { selectAll: allLUUnitTableColumns, selectColumnString: luUnitTableColumnsString } = getLUUnitTableColumnsSelector(
  (state: RootState) => state.lakarutlatandeUnitTableColumns
)
