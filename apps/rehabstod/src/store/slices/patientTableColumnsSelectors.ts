import { RootState } from '../store'
import { getPatientTableColumnsSelectors } from './patientTableColumnsSlice'

export const { selectAll: allPatientColumns, selectColumnString: patientColumnsString } = getPatientTableColumnsSelectors(
  (state: RootState) => state.patientTableColumns
)
