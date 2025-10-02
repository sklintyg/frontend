import type {
  ConfigUeMedicalInvestigation,
  ConfigUeMedicalInvestigationList,
  ValueMedicalInvestigation,
  ValueMedicalInvestigationList,
} from '../../../types'
import { Table } from '../../Table/Table'
import { TableCell } from '../../Table/TableCell'
import { TableHeader } from '../../Table/TableHeader'
import { TableRow } from '../../Table/TableRow'
import { Badge } from '../Badge'

const getMedicalValue = (value: ValueMedicalInvestigationList, medicalConfig: ConfigUeMedicalInvestigation) => {
  return value.list.find((item) => item.investigationType.id === medicalConfig.investigationTypeId)
}

const getCodeValue = (medicalConfig: ConfigUeMedicalInvestigation, medicalValue: ValueMedicalInvestigation | undefined) => {
  return medicalConfig.typeOptions.find((value) => value.code === medicalValue?.investigationType.code)
}

const isMedicalInvestigationListEmpty = (config: ConfigUeMedicalInvestigationList, value: ValueMedicalInvestigationList) => {
  let isEmpty = true
  config.list.forEach((medicalConfig) => {
    const medicalValue = getMedicalValue(value, medicalConfig)
    const codeValue = getCodeValue(medicalConfig, medicalValue)
    if (codeValue && medicalValue && medicalValue.informationSource.text) {
      isEmpty = false
    }
  })
  return isEmpty
}
export const UvMedicalInvestigationList = ({
  value,
  config,
}: {
  value: ValueMedicalInvestigationList
  config: ConfigUeMedicalInvestigationList
}) =>
  isMedicalInvestigationListEmpty(config, value) ? (
    <Badge>
      <p>Ej angivet</p>
    </Badge>
  ) : (
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
                <TableCell data-testid="informationSource">{medicalValue.informationSource.text}</TableCell>
              </TableRow>
            )
          )
        })}
      </tbody>
    </Table>
  )
