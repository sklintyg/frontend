import { RootState } from '../store'
import { getLakarutlatandenTableColumnsSelector } from './lakarutlatandenTableColumns.slice'

export const { selectAll: allLakarutlatandenTableColumns, selectColumnString: lakarutlatandenTableColumnsString } =
  getLakarutlatandenTableColumnsSelector((state: RootState) => state.lakarutlatandenTableColumns)
