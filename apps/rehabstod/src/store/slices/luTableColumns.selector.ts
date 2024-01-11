import { getLUTableColumnsSelectors } from './luTableColumns.slice'
import { RootState } from '../store'

export const { selectAll: allLUTableColumns, selectColumnString: luTableColumnsString } = getLUTableColumnsSelectors(
  (state: RootState) => state.lakarutlatandenTableColumns
)
