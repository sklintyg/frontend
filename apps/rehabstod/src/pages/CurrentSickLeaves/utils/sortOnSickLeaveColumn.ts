import { SickLeaveColumn, SickLeaveInfo } from '../../../store/types/sickLeave'
import { getColumnData } from './getColumnData'

export function sortOnSickLeaveColumn(column: SickLeaveColumn) {
  return (a: SickLeaveInfo, b: SickLeaveInfo) => ((getColumnData(column, a) ?? -1) > (getColumnData(column, b) ?? -1) ? 1 : -1)
}
