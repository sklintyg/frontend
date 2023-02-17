import React from 'react'
import { ValueDiagnosisList } from '../../../types'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../Table'
import { Badge } from '../Badge'

export const UvDiagnosisList: React.FC<{
  value: ValueDiagnosisList
}> = ({ value }) => {
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
