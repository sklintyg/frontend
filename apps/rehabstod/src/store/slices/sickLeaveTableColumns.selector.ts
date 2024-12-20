import type { RootState } from '../reducer'
import { getSickLeaveTableColumnsSelectors } from './sickLeaveTableColumns.slice'

export const { selectAll: allSickLeaveColumns, selectColumnString: sickLeaveColumnsString } = getSickLeaveTableColumnsSelectors(
  (state: RootState) => state.sjukfallTableColumns
)
