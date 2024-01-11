import { getPatientTableColumnsSelectors } from './patientTableColumns.slice'
import { RootState } from '../store'

export const { selectAll: allPatientColumns, selectColumnString: patientColumnsString } = getPatientTableColumnsSelectors(
  (state: RootState) => state.patientTableColumns
)
