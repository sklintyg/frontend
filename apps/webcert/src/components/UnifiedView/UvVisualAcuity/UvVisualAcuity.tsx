import type React from 'react'
import type { ConfigUeVisualAcuity, ValueVisualAcuity } from '../../../types'
import { formatAcuity } from '../../../utils/format/formatAcuity'
import { Table } from '../../Table/Table'
import { TableBody } from '../../Table/TableBody'
import { TableCell } from '../../Table/TableCell'
import { TableHeader } from '../../Table/TableHeader'
import { TableRow } from '../../Table/TableRow'

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
        {config.contactLensesLabel && <TableCell>{config.contactLensesLabel}</TableCell>}
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
          {contactLenses && <TableCell>{contactLenses ? (contactLenses.selected === true ? 'Ja' : 'Nej') : '-'}</TableCell>}
        </TableRow>
      ))}
    </TableBody>
  </Table>
)
