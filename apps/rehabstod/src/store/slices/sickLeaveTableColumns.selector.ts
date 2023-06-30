import { RootState } from '../store'
import { getSickLeaveTableColumnsSelector } from './sickLeaveTableColumns.slice'

export const { selectAll: allSickLeaveColumns, selectColumnString: sickLeaveColumnsString } = getSickLeaveTableColumnsSelector(
  (state: RootState) => state.sjukfallTableColumns
)
