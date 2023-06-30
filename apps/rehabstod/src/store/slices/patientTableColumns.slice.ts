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
  Risk = 'Risk',
  Intyg = 'Intyg',
  Visa = 'Visa',
}

export const { slice: patientTableColumnsSlice, getSelectors: getPatientTableColumnsSelectors } = createTableColumnSlice(
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
export const { name: patientTableColumnsReducerPath, reducer: patientTableColumnsReducer } = patientTableColumnsSlice
