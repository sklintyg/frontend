import React from 'react'
import { ConfigUeSickLeavePeriod, ValueDateRangeList } from '../../../types'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../Table'
import { Badge } from '../Badge'

export const UvDateRangeList: React.FC<{
  value: ValueDateRangeList
  config: ConfigUeSickLeavePeriod
}> = ({ value, config }) => {
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
