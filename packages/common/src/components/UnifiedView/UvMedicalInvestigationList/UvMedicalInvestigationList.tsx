import React from 'react'
import { ConfigUeMedicalInvestigationList, ValueMedicalInvestigationList } from '../../..'
import { Table, TableHeader, TableRow, TableCell } from '../../Table'

export const UvMedicalInvestigationList: React.FC<{
  value: ValueMedicalInvestigationList
  config: ConfigUeMedicalInvestigationList
}> = ({ value, config }) => (
  <div className={'iu-p-none'}>
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>{config.typeText}</TableCell>
          <TableCell>{config.dateText}</TableCell>
          <TableCell>{config.informationSourceText}</TableCell>
        </TableRow>
      </TableHeader>
      <tbody>
        {config.list.map((medicalConfig) => {
          const medicalValue = value.list.find((item) => item.investigationType.id === medicalConfig.investigationTypeId)
          const codeValue = medicalConfig.typeOptions.find((value) => value.code === medicalValue?.investigationType.code)
          return (
            codeValue &&
            medicalValue &&
            medicalValue.informationSource.text && (
              <TableRow key={medicalValue.investigationType.id}>
                <TableCell>{codeValue.label}</TableCell>
                <TableCell>{medicalValue.date.date}</TableCell>
                <TableCell>{medicalValue.informationSource.text}</TableCell>
              </TableRow>
            )
          )
        })}
      </tbody>
    </Table>
  </div>
)
