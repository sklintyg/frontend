import { SickLeaveColumn, SickLeaveInfo } from '../../../schemas/sickLeaveSchema'
import { sortOnSickLeaveColumn } from './sortOnSickLeaveColumn'

export function getSortedSickLeaves(sickLeaves: SickLeaveInfo[], ascending: boolean, column: SickLeaveColumn) {
  const sorted = sickLeaves.slice().sort(sortOnSickLeaveColumn(column))
  return ascending ? sorted.reverse() : sorted
}
