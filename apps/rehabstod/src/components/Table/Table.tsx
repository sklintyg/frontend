import type { ReactNode } from 'react'
import { createContext, useCallback, useMemo, useRef, useState } from 'react'
import { getTableSorter } from '../../utils/getTableSorter'
import { FixedTable } from './FixedTable'
import { FloatingTableScroll } from './FloatingTableScroll/FloatingTableScroll'

import '@inera/ids-design/components/data-table/data-table.css'

export interface TableOptions {
  ascending?: boolean
  sortColumn?: string
  onSortChange?: (state: { sortColumn: string; ascending: boolean }) => void
}

export const TableContext = createContext<ReturnType<typeof useTable> | null>(null)

export function useTable(options: TableOptions) {
  const [ascending, setAscending] = useState(options.ascending ?? false)
  const [sortColumn, setSortColumn] = useState(options.sortColumn ?? '')
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
      scrollDiv,
      setScrollDiv,
    }),
    [ascending, sortColumn, sortOnColumn, sortTableList, scrollDiv]
  )
}

export function Table({
  children,
  print,
  header,
  ...options
}: { children?: ReactNode; print?: ReactNode; header?: ReactNode } & TableOptions) {
  const table = useTable(options)
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <TableContext.Provider value={table}>
      <div className="print:hidden">
        <FloatingTableScroll ref={scrollRef}>
          <FixedTable scrollRef={scrollRef}>{header}</FixedTable>
          <table className="ids-data-table ids-table-rounded w-full overflow-visible whitespace-nowrap border-none text-sm">
            {header}
            {children}
          </table>
        </FloatingTableScroll>
      </div>
      {print}
    </TableContext.Provider>
  )
}
