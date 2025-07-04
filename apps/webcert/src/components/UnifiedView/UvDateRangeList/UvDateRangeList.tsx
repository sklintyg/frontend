import type { ConfigUeCheckboxDateRangeList, ValueDateRangeList } from '../../../types'
import { Table } from '../../Table/Table'
import { TableBody } from '../../Table/TableBody'
import { TableCell } from '../../Table/TableCell'
import { TableHeader } from '../../Table/TableHeader'
import { TableRow } from '../../Table/TableRow'
import { Badge } from '../Badge'

export const UvDateRangeList = ({ value, config }: { value: ValueDateRangeList; config: ConfigUeCheckboxDateRangeList }) => {
  if (value.list.length > 0 && value.list.some((val) => val.from && val.to)) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Nedsättningsgrad</TableCell>
            <TableCell>Från och med</TableCell>
            <TableCell>Till och med</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...config.list].reverse().map((element) => {
            const foundValue = value.list.find((v) => v.id === element.id && (v.from || v.to))
            return (
              foundValue && (
                <TableRow key={element.id}>
                  <TableCell>{element.label}</TableCell>
                  <TableCell>{foundValue.from}</TableCell>
                  <TableCell>{foundValue.to}</TableCell>
                </TableRow>
              )
            )
          })}
        </TableBody>
      </Table>
    )
  }
  return (
    <Badge>
      <p>Ej angivet</p>
    </Badge>
  )
}
