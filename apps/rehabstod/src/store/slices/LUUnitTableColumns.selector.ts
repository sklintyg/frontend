import { RootState } from '../store'
import { getLakarutlatandeUnitTableColumnsSelector } from './LUUnitTableColumns.slice'

export const { selectAll: allLakarutlatandeUnitTableColumns, selectColumnString: lakarutlatandeUnitTableColumnsString } =
  getLakarutlatandeUnitTableColumnsSelector((state: RootState) => state.lakarutlatandeUnitTableColumns)
