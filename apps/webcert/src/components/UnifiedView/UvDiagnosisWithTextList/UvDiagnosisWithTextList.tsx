import type { ConfigUeDiagnosesWithText, ValueDiagnosisWithText, ValueDiagnosisWithTextList } from '../../../types'
import { Table } from '../../Table/Table'
import { TableBody } from '../../Table/TableBody'
import { TableCell } from '../../Table/TableCell'
import { TableHeader } from '../../Table/TableHeader'
import { TableRow } from '../../Table/TableRow'
import { Badge } from '../Badge'

/** The answered rows in config order; a row is answered when its diagnosis has a code. */
const getAnsweredRows = (config: ConfigUeDiagnosesWithText, value: ValueDiagnosisWithTextList): ValueDiagnosisWithText[] =>
  config.list
    .map(({ id }) => value.list.find((item) => item.id === id))
    .filter((row): row is ValueDiagnosisWithText => row != null && !!row.diagnosis.code)

export const UvDiagnosisWithTextList = ({ value, config }: { value: ValueDiagnosisWithTextList; config: ConfigUeDiagnosesWithText }) => {
  const rows = getAnsweredRows(config, value)

  if (rows.length === 0) {
    return (
      <Badge>
        <p>Ej angivet</p>
      </Badge>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <th scope="col" colSpan={2}>
            Diagnoskod enligt {config.terminology[0]?.label}
          </th>
          <TableCell>{config.textLabel}</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ id, diagnosis, text }) => (
          <TableRow key={id}>
            <TableCell style={{ minWidth: '6rem' }}>{diagnosis.code}</TableCell>
            <TableCell>{diagnosis.description}</TableCell>
            <TableCell>{text.text}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
