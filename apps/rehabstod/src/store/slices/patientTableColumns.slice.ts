import { createTableColumnSlice } from '../utils/createTableColumnSlice'

export enum PatientColumn {
  Num = '#',
  Diagnos = 'Diagnos/er',
  Grad = 'Grad',
  Startdatum = 'Startdatum',
  Slutdatum = 'Slutdatum',
  Längd = 'Längd',
  Ärenden = 'Ärenden',
  Läkare = 'Läkare',
  Sysselsättning = 'Sysselsättning',
  Vårdenhet = 'Vårdenhet',
  Vårdgivare = 'Vårdgivare',
  Intyg = 'Intyg',
  Visa = 'Visa',
}

export const { patientTableColumnsSlice, getPatientTableColumnsSelector, patientTableColumnsReducerPath } = createTableColumnSlice(
  'patientTableColumns',
  Object.values(PatientColumn)
)

export const {
  reset: resetPatientTableColumns,
  showColumn,
  hideColumn,
  showAllColumns,
  hideAllColumns,
  moveColumn,
  setColumnDefaults,
} = patientTableColumnsSlice.actions
