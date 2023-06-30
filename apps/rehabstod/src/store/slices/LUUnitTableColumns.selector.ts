import { RootState } from '../store'
import { getLUUnitTableColumnsSelector } from './LUUnitTableColumns.slice'

export const { selectAll: allLUUnitTableColumns, selectColumnString: luUnitTableColumnsString } = getLUUnitTableColumnsSelector(
  (state: RootState) => state.lakarutlatandeUnitTableColumns
)
