import React from 'react'
import { TableHeader, TableRow, TableCell, TableBody, Table } from '../../Table'
import { ValueViewTable, ConfigUeViewTable, ConfigViewColumn, ValueText, ValueTextRow } from '../../..'

export const UvTable: React.FC<{
  value: ValueViewTable
  config: ConfigUeViewTable
}> = ({ config: { columns }, value: { rows } }) => {
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
