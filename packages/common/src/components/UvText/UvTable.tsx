import { ConfigViewColumn, ValueText, ValueTextRow } from '@frontend/common'
import React from 'react'

export interface Props {
  columns: ConfigViewColumn[]
  rows: ValueTextRow[]
}

const UvTable: React.FC<Props> = ({ columns, rows }) => {
  return (
    <table className="ic-table iu-fullwidth">
      <thead>
        <tr>
          {columns.map((column: ConfigViewColumn, index: number) => (
            <th key={index} scope="col">
              {column.text}
            </th>
          ))}
        </tr>
      </thead>
      {rows && (
        <tbody>
          {rows.map((row: ValueTextRow, index: number) => (
            <tr key={index}>
              {columns.map((column: ConfigViewColumn, index: number) => (
                <td key={index}>{row.columns.find((rowColumn: ValueText) => rowColumn.id === column.id)?.text ?? ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      )}
    </table>
  )
}

export default UvTable
