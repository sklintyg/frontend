import { TableColumn } from '../../../schemas/tableSchema'
import { SickLeaveColumn } from '../../../store/slices/sickLeaveTableColumns.slice'

export function sickLeaveColumnFilter(showPersonalInformation: boolean, isDoctor: boolean, srsActivated: boolean) {
  return ({ visible, name }: TableColumn) => {
    if (visible) {
      if (!showPersonalInformation && (name === SickLeaveColumn.Personnummer || name === SickLeaveColumn.Namn)) {
        return false
      }

      if (isDoctor && name === SickLeaveColumn.Läkare) {
        return false
      }

      if (!srsActivated && name === SickLeaveColumn.Risk) {
        return false
      }

      return true
    }
    return false
  }
}
