import type React from 'react'
import styled from 'styled-components'
import type { ConfigUeDateRange, ValueDateRange } from '../../../types'
import { Table } from '../../Table/Table'
import { TableHeader } from '../../Table/TableHeader'
import { TableRow } from '../../Table/TableRow'
import { TableCell } from '../../Table/TableCell'
import { TableBody } from '../../Table/TableBody'

const DateRangeWrapper = styled.div`
  display: inline-block;
`

export const UvDateRange: React.FC<{ value: ValueDateRange; config: ConfigUeDateRange }> = ({ value, config }) => {
  return (
    <div className={'iu-p-none'}>
      <Table style={{ tableLayout: 'fixed', width: '100%' }}>
        <TableHeader>
          <TableRow>
            <TableCell style={{ width: '50%' }}>Från och med</TableCell>
            <TableCell style={{ width: '50%' }}>Till och med</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow key={config.id}>
            <TableCell>{typeof value.from === 'string' && value.from.length > 0 ? value.from : 'Ej angivet'}</TableCell>
            <TableCell>{typeof value.to === 'string' && value.to.length > 0 ? value.to : 'Ej angivet'}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
