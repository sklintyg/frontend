import type { ValueDiagnosisList } from '../../../types'
import { Table } from '../../Table/Table'
import { TableBody } from '../../Table/TableBody'
import { TableCell } from '../../Table/TableCell'
import { TableHeader } from '../../Table/TableHeader'
import { TableRow } from '../../Table/TableRow'
import { Badge } from '../Badge'

export const UvDiagnosisList = ({ value }: { value: ValueDiagnosisList }) => {
  if (value.list && value.list.length > 0) {
    return (
      <div className={'iu-p-none'}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Diagnoskod enligt ICD-10 SE</TableCell>
              <TableCell />
            </TableRow>
          </TableHeader>
          <TableBody>
            {value.list.map(({ code, description }) => (
              <TableRow key={code}>
                <TableCell>{code}</TableCell>
                <TableCell>{description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
  return (
    <Badge>
      <p>Ej angivet</p>
    </Badge>
  )
}
