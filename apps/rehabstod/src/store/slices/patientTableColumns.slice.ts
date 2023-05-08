import { createTableColumnSlice } from '../utils/createTableColumnSlice'

export enum PatientColumn {
  Num = '#',
  Diagnos = 'Diagnos/er',
  Grad = 'Grad',
  Slutdatum = 'Slutdatum',
  Startdatum = 'Startdatum',
  Längd = 'Längd',
  Ärenden = 'Ärenden',
  Läkare = 'Läkare',
  Sysselsättning = 'Sysselsättning',
  Intyg = 'Intyg',
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
} = patientTableColumnsSlice.actions
export const { name: patientTableColumnsReducerPath, reducer: patientTableColumnsReducer } = patientTableColumnsSlice
