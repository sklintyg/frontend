import { createTableColumnSlice } from '../utils/createTableColumnSlice'

export enum PatientColumn {
  Num = '#',
  Intygstyp = 'Intygstyp',
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
}

export const {
  slice: patientTableColumnsSlice,
  getSelectors: getPatientTableColumnsSelectors,
  reducerPath: patientTableColumnsReducerPath,
} = createTableColumnSlice('patientTableColumns', Object.values(PatientColumn))

export const {
  reset: resetPatientTableColumns,
  showColumn,
  hideColumn,
  showAllColumns,
  hideAllColumns,
  moveColumn,
  setColumnDefaults,
} = patientTableColumnsSlice.actions
