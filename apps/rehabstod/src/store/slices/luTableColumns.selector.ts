import { RootState } from '../store'
import { getLUTableColumnsSelectors } from './luTableColumns.slice'

export const { selectAll: allLUTableColumns, selectColumnString: luTableColumnsString } = getLUTableColumnsSelectors(
  (state: RootState) => state.lakarutlatandenTableColumns
)
