import { getLUUnitTableColumnsSelectors } from './luUnitTableColumns.slice'
import { RootState } from '../store'

export const { selectAll: allLUUnitTableColumns, selectColumnString: luUnitTableColumnsString } = getLUUnitTableColumnsSelectors(
  (state: RootState) => state.lakarutlatandeUnitTableColumns
)
