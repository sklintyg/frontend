import { RootState } from '../store'
import { getLuCertificatesColumnsSelectors } from './luCertificatesTableColumns.slice'

export const { selectAll: allLuCertificatesColumns, selectColumnString: luCertificatesColumnsString } = getLuCertificatesColumnsSelectors(
  (state: RootState) => state.lakarutlatandeUnitTableColumns
)
