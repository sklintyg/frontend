import { RootState } from '../store'
import { getSjukfallTableColumnsSelector } from './sjukfallTableColumns.slice'

export const { selectAll: allSickLeaveColumns, selectColumnString: sickLeaveColumnsString } = getSjukfallTableColumnsSelector(
  (state: RootState) => state.sjukfallTableColumns
)
