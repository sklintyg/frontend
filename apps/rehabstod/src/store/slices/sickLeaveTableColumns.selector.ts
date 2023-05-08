import { RootState } from '../store'
import { getSjukfallTableColumnsSelectors as getSickLeaveTableColumnsSelectors } from './sickLeaveTableColumns.slice'

export const { selectAll: allSickLeaveColumns, selectColumnString: sickLeaveColumnsString } = getSickLeaveTableColumnsSelectors(
  (state: RootState) => state.sjukfallTableColumns
)
