import { IDSContainer } from '@frontend/ids-react-ts'
import { createContext, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getTableSorter } from '../../utils/getTableSorter'

interface TableOptions {
  ascending?: boolean
  sortColumn?: string
  onSortChange?: (state: { sortColumn: string; ascending: boolean }) => void
}

function useTable(options: TableOptions) {
  const [ascending, setAscending] = useState(options.ascending ?? false)
  const [sortColumn, setSortColumn] = useState(options.sortColumn ?? '')
  const firstUpdate = useRef(true)

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }

    if (options.onSortChange) {
      options.onSortChange({ sortColumn, ascending })
    }
  }, [ascending, options, sortColumn])

  const sortOnColumn = useCallback(
    (desiredColumn: string) => {
      if (desiredColumn !== sortColumn) {
        setSortColumn(desiredColumn)
        setAscending(options.ascending ?? false)
      } else {
        setAscending(!ascending)
      }
    },
    [ascending, sortColumn, options.ascending]
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

export function Table({ children, print, ...options }: { children?: ReactNode; print?: ReactNode } & TableOptions) {
  const table = useTable(options)

  return (
    <TableContext.Provider value={table}>
      <IDSContainer gutterless className="overflow-x-auto pb-4 pt-1 print:hidden">
        <div className="relative">
          <table className="ids-table w-full overflow-visible whitespace-nowrap border-none text-sm">{children}</table>
        </div>
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
