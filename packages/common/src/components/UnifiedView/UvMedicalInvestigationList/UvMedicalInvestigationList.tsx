import React from 'react'
import {
  Badge,
  ConfigUeMedicalInvestigation,
  ConfigUeMedicalInvestigationList,
  ValueMedicalInvestigation,
  ValueMedicalInvestigationList,
} from '../../..'
import { Table, TableHeader, TableRow, TableCell } from '../../Table'

const getMedicalValue = (value: ValueMedicalInvestigationList, medicalConfig: ConfigUeMedicalInvestigation) => {
  return value.list.find((item) => item.investigationType.id === medicalConfig.investigationTypeId)
}

const getCodeValue = (medicalConfig: ConfigUeMedicalInvestigation, medicalValue: ValueMedicalInvestigation | undefined) => {
  return medicalConfig.typeOptions.find((value) => value.code === medicalValue?.investigationType.code)
}

const isMedicalInvestigationListEmpty = (config: ConfigUeMedicalInvestigationList, value: ValueMedicalInvestigationList) => {
  config.list.forEach((medicalConfig) => {
    const medicalValue = getMedicalValue(value, medicalConfig)
    const codeValue = getCodeValue(medicalConfig, medicalValue)
    if (codeValue && medicalValue && medicalValue.informationSource.text) {
      return false
    }
  })
  return true
}
export const UvMedicalInvestigationList: React.FC<{
  value: ValueMedicalInvestigationList
  config: ConfigUeMedicalInvestigationList
}> = ({ value, config }) =>
  isMedicalInvestigationListEmpty(config, value) ? (
    <div>
      <h4>{config.typeText}</h4>
      <Badge>
        <p>Ej angivet</p>
      </Badge>
    </div>
  ) : (
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
            const medicalValue = getMedicalValue(value, medicalConfig)
            const codeValue = getCodeValue(medicalConfig, medicalValue)
            return (
              codeValue &&
              medicalValue &&
              medicalValue.informationSource.text && (
                <TableRow key={medicalValue.investigationType.id}>
                  <TableCell style={{ minWidth: '8rem' }}>{codeValue.label}</TableCell>
                  <TableCell style={{ minWidth: '8rem' }}>{medicalValue.date.date}</TableCell>
                  <TableCell>{medicalValue.informationSource.text}</TableCell>
                </TableRow>
              )
            )
          })}
        </tbody>
      </Table>
    </div>
  )
