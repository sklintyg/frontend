import { RootState } from '../store'
import { getSjukfallTableColumnsSelectors } from './sjukfallTableColumnsSlice'

export const { selectAll: allSjukfallColumns, selectColumnString: sjukfallColumnsString } = getSjukfallTableColumnsSelectors(
  (state: RootState) => state.sjukfallTableColumns
)
