import { TableHeaderCell } from '../../../components/Table/TableHeaderCell'
import { SickLeaveColumn } from '../../../schemas/sickLeaveSchema'

export function PatientTableHeader() {
  return (
    <thead>
      <tr>
        <TableHeaderCell column={SickLeaveColumn.Num} width="62px" />
        <TableHeaderCell column={SickLeaveColumn.Diagnos} width="255px" />
        <TableHeaderCell column={SickLeaveColumn.Startdatum} width="146px" />
        <TableHeaderCell column={SickLeaveColumn.Slutdatum} width="146px" />
        <TableHeaderCell column={SickLeaveColumn.Längd} width="96px" />
        <TableHeaderCell column={SickLeaveColumn.Grad} width="102px" />
        <TableHeaderCell column={SickLeaveColumn.Ärenden} width="134px" />
        <TableHeaderCell column={SickLeaveColumn.Läkare} width="114px" />
        <TableHeaderCell column={SickLeaveColumn.Sysselsättning} width="169px" />
        <TableHeaderCell column={SickLeaveColumn.Intyg} sticky="right" width="96px" />
      </tr>
    </thead>
  )
}
