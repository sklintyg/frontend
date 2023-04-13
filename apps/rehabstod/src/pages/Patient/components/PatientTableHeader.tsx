import { TableHeaderCell } from '../../../components/Table/TableHeaderCell'
import { SickLeaveColumn } from '../../../schemas/sickLeaveSchema'

export function PatientTableHeader() {
  return (
    <thead>
      <tr>
        <TableHeaderCell column={SickLeaveColumn.Num} />
        <TableHeaderCell
          column={SickLeaveColumn.Diagnos}
          description="Diagnos/diagnoser i nuvarande intyg. Om det finns flera diagnoser så visas den som påverkar arbetsförmågan mest först. För muspekaren över diagnoskoden för att se diagnos i text."
        />
        <TableHeaderCell column={SickLeaveColumn.Startdatum} />
        <TableHeaderCell column={SickLeaveColumn.Slutdatum} />
        <TableHeaderCell column={SickLeaveColumn.Längd} />
        <TableHeaderCell column={SickLeaveColumn.Grad} />
        <TableHeaderCell column={SickLeaveColumn.Ärenden} />
        <TableHeaderCell column={SickLeaveColumn.Läkare} />
        <TableHeaderCell column={SickLeaveColumn.Sysselsättning} />
        <TableHeaderCell column={SickLeaveColumn.Intyg} />
      </tr>
    </thead>
  )
}
