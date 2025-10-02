import '@inera/ids-design/components/data-table/data-table.css'
import type { ReactNode } from 'react'
import { createContext, useCallback, useMemo, useRef, useState } from 'react'
import { classNames } from '../../utils/classNames'
import { getTableSorter } from '../../utils/getTableSorter'
import { FixedTable } from './FixedTable'
import { FloatingTableScroll } from './FloatingTableScroll/FloatingTableScroll'

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
      <div className="print:hidden [&:not(:last-child)]:mb-5">
        <FloatingTableScroll ref={scrollRef}>
          <FixedTable scrollRef={scrollRef}>{header}</FixedTable>
          <table
            className={classNames(
              'table-fixed m-0 w-full overflow-visible whitespace-nowrap border-none text-sm'
              // interactive && 'ids-data-table--interactive'
            )}
          >
            {header}
            {children}
          </table>
        </FloatingTableScroll>
      </div>
      {print}
    </TableContext.Provider>
  )
}
