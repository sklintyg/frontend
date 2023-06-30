import { RootState } from '../store'
import { getLUUnitTableColumnsSelectors } from './luUnitTableColumns.slice'

export const { selectAll: allLUUnitTableColumns, selectColumnString: luUnitTableColumnsString } = getLUUnitTableColumnsSelectors(
  (state: RootState) => state.lakarutlatandeUnitTableColumns
)
