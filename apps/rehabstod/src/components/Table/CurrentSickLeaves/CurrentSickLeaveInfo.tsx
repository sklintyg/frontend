import { getSickLeaveContent } from '../../../utils/listUtils'
import { SickLeaveInfo } from '../../../store/types/sickLeave'

export function CurrentSickLeaveInfo({ sickLeave, header }: { sickLeave: SickLeaveInfo; header: string }) {
  return <td>{getSickLeaveContent(header, sickLeave)}</td>
}
