import React from 'react'
import { ConfigUeVisualAcuity, ValueVisualAcuity } from '../../../types'
import { formatAcuity } from '../../../utils'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../Table'

export const UvVisualAcuity: React.FC<{
  value: ValueVisualAcuity
  config: ConfigUeVisualAcuity
}> = ({ value, config }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableCell></TableCell>
        <TableCell>{config.withoutCorrectionLabel}</TableCell>
        <TableCell>{config.withCorrectionLabel}</TableCell>
        <TableCell>{config.contactLensesLabel}</TableCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      {[
        { ...value.rightEye, label: config.rightEye.label },
        { ...value.leftEye, label: config.leftEye.label },
        { ...value.binocular, label: config.binocular.label },
      ].map(({ label, withoutCorrection, withCorrection, contactLenses }, index) => (
        <TableRow key={index}>
          <TableCell>{label}</TableCell>
          <TableCell>{formatAcuity(`${withoutCorrection.value}`)}</TableCell>
          <TableCell>{formatAcuity(`${withCorrection.value}`)}</TableCell>
          <TableCell>{contactLenses ? (contactLenses.selected === true ? 'Ja' : 'Nej') : '-'}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)
