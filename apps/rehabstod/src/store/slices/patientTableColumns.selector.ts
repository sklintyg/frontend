import { RootState } from '../store'
import { getPatientTableColumnsSelector } from './patientTableColumns.slice'

export const { selectAll: allPatientColumns, selectColumnString: patientColumnsString } = getPatientTableColumnsSelector(
  (state: RootState) => state.patientTableColumns
)
