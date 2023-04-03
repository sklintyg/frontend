import { SickLeaveColumn, SickLeaveInfo } from '../../../store/types/sickLeave'
import { sortOnSickLeaveColumn } from './sortOnSickLeaveColumn'

export function getSortedSickLeaves(sickLeaves: SickLeaveInfo[], ascending: boolean, column: SickLeaveColumn) {
  const sorted = sickLeaves.slice().sort(sortOnSickLeaveColumn(column))
  return ascending ? sorted.reverse() : sorted
}
