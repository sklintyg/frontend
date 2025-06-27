import type React from 'react'
import type { ConfigUeViewTable, ConfigViewColumn, ValueText, ValueTextRow, ValueViewTable } from '../../../types'
import { Table } from '../../Table/Table'
import { TableBody } from '../../Table/TableBody'
import { TableCell } from '../../Table/TableCell'
import { TableHeader } from '../../Table/TableHeader'
import { TableRow } from '../../Table/TableRow'

export const UvTable = ({ config: { columns }, value: { rows } }: { value: ValueViewTable; config: ConfigUeViewTable }) => {
  return (
    rows && (
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column: ConfigViewColumn, index: number) => (
              <TableCell key={index}>{column.text}</TableCell>
            ))}
          </TableRow>
        </TableHeader>
        {
          <TableBody>
            {rows.map((row: ValueTextRow, index: number) => (
              <TableRow key={index}>
                {columns.map((column: ConfigViewColumn, index: number) => (
                  <TableCell key={index}>{row.columns.find((rowColumn: ValueText) => rowColumn.id === column.id)?.text ?? ''}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        }
      </Table>
    )
  )
}
