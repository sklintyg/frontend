import { RootState } from '../store'
import { getLUTableColumnsSelector } from './LUTableColumns.slice'

export const { selectAll: allLUTableColumns, selectColumnString: luTableColumnsString } = getLUTableColumnsSelector(
  (state: RootState) => state.lakarutlatandenTableColumns
)
