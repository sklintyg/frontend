import { getSickLeaveTableColumnsSelectors } from './sickLeaveTableColumns.slice'
import { RootState } from '../store'

export const { selectAll: allSickLeaveColumns, selectColumnString: sickLeaveColumnsString } = getSickLeaveTableColumnsSelectors(
  (state: RootState) => state.sjukfallTableColumns
)
