import { RootState } from '../store'
import { getPatientTableColumnsSelectors } from './patientTableColumns.slice'

export const { selectAll: allPatientColumns, selectColumnString: patientColumnsString } = getPatientTableColumnsSelectors(
  (state: RootState) => state.patientTableColumns
)
