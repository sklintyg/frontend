import type React from 'react'
import type { ConfigUeVisualAcuity, ValueVisualAcuity } from '../../../types'
import { Table } from '../../Table/Table'
import { TableBody } from '../../Table/TableBody'
import { TableCell } from '../../Table/TableCell'
import { TableHeader } from '../../Table/TableHeader'
import { TableRow } from '../../Table/TableRow'
import { formatFixed } from '../../../utils/format/formatAcuity'

export const UvVisualAcuity = ({ value, config }: { value: ValueVisualAcuity; config: ConfigUeVisualAcuity }) => (
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
          <TableCell>{withoutCorrection.value != null ? formatFixed(`${withoutCorrection.value}`) : ''}</TableCell>
          <TableCell>{withCorrection.value != null ? formatFixed(`${withCorrection.value}`) : ''}</TableCell>
          {contactLenses && <TableCell>{contactLenses ? (contactLenses.selected === true ? 'Ja' : 'Nej') : '-'}</TableCell>}
        </TableRow>
      ))}
    </TableBody>
  </Table>
)
