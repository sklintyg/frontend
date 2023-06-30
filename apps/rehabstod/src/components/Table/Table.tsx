import { IDSContainer } from '@frontend/ids-react-ts'
import { createContext, ReactNode, useCallback, useMemo, useState } from 'react'
import { getTableSorter } from '../../utils/getTableSorter'
import { FloatingScroll } from '../FloatingScroll/FloatingScroll'

interface TableOptions {
  ascending?: boolean
  sortColumn?: string
  onSortChange?: (state: { sortColumn: string; ascending: boolean }) => void
}

function useTable(options: TableOptions) {
  const [ascending, setAscending] = useState(options.ascending ?? false)
  const [sortColumn, setSortColumn] = useState(options.sortColumn ?? '')

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
    }),
    [ascending, sortColumn, sortOnColumn, sortTableList]
  )
}

export const TableContext = createContext<ReturnType<typeof useTable> | null>(null)

export function Table({
  children,
  print,
  contentDivId,
  scrollDivId,
  ...options
}: { children?: ReactNode; print?: ReactNode; contentDivId: string; scrollDivId: string } & TableOptions) {
  const table = useTable(options)

  return (
    <TableContext.Provider value={table}>
      <IDSContainer gutterless className="print:hidden">
        <FloatingScroll id={scrollDivId}>
          <div id={contentDivId} className="relative pb-4 pt-1">
            <table className="ids-table w-full overflow-visible whitespace-nowrap border-none text-sm">{children}</table>
          </div>
        </FloatingScroll>
      </IDSContainer>
      <div className="hidden print:block">
        <div className="mb-2">
          Tabellen är sorterad enligt <span className="font-bold">{table.sortColumn}</span> i {table.ascending ? 'stigande' : 'fallande'}{' '}
          ordning
        </div>
        {print}
      </div>
    </TableContext.Provider>
  )
}
