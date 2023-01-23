import React from 'react'
import { ConfigUeMedicalInvestigationList, ValueMedicalInvestigationList } from '../../..'
import { Table, TableHeader, TableRow, TableCell } from '../../Table'

export const UvMedicalInvestigationList: React.FC<{
  value: ValueMedicalInvestigationList
  config: ConfigUeMedicalInvestigationList
}> = ({ value, config }) => {
  let hasCells = false
  return (
    <div className={'iu-p-none'}>
      {config.list.map((medicalConfig) => {
        const medicalValue = value.list.find((item) => item.investigationType.id === medicalConfig.investigationTypeId)
        const codeValue = medicalConfig.typeOptions.find((value) => value.code === medicalValue?.investigationType.code)
        if (codeValue && medicalValue && medicalValue.informationSource.text) {
          hasCells = true
        }
      })}

      {hasCells && (
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
                    {codeValue.label && <TableCell style={{ minWidth: '8rem' }}>{codeValue.label}</TableCell>}
                    {medicalValue.date.date && <TableCell style={{ minWidth: '8rem' }}>{medicalValue.date.date}</TableCell>}
                    {medicalValue.informationSource.text && <TableCell>{medicalValue.informationSource.text}</TableCell>}
                  </TableRow>
                )
              )
            })}
          </tbody>
        </Table>
      )}
    </div>
  )
  return null
}
