import { RootState } from '../store'
import { getLakarutlatandeUnitTableColumnsSelector } from './lakarutlatandeUnitTableColumns.slice'

export const { selectAll: allLakarutlatandeUnitTableColumns, selectColumnString: lakarutlatandeUnitTableColumnsString } =
  getLakarutlatandeUnitTableColumnsSelector((state: RootState) => state.lakarutlatandeUnitTableColumns)
