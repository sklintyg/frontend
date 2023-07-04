import { createContext, useCallback, useMemo, useState } from 'react'
import { getTableSorter } from '../../../utils/getTableSorter'

export interface TableOptions {
  ascending?: boolean
  sortColumn?: string
  onSortChange?: (state: { sortColumn: string; ascending: boolean }) => void
}

export function useTable(options: TableOptions) {
  const [ascending, setAscending] = useState(options.ascending ?? false)
  const [sortColumn, setSortColumn] = useState(options.sortColumn ?? '')
  const [tableWidth, setTableWidth] = useState(0)
  const [scrollDiv, setScrollDiv] = useState<HTMLDivElement>()

  const updateSorting = useCallback(
    (column: string, asc: boolean) => {
      setSortColumn(column)
      setAscending(asc)
      if (options.onSortChange) {
        options.onSortChange({ sortColumn: column, ascending: asc })
      }
    },
    [options]
  )

  const sortOnColumn = useCallback(
    (desiredColumn: string) => {
      if (desiredColumn !== sortColumn) {
        updateSorting(desiredColumn, options.ascending ?? false)
      } else {
        updateSorting(sortColumn, !ascending)
      }
    },
    [ascending, options.ascending, sortColumn, updateSorting]
  )

  const sortTableList = getTableSorter(sortColumn, ascending)

  return useMemo(
    () => ({
      ascending,
      sortColumn,
      sortOnColumn,
      sortTableList,
      tableWidth,
      setTableWidth,
      scrollDiv,
      setScrollDiv,
    }),
    [ascending, sortColumn, sortOnColumn, sortTableList, tableWidth, setTableWidth, scrollDiv, setScrollDiv]
  )
}

export const TableContext = createContext<ReturnType<typeof useTable> | null>(null)
