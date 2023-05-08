import { IDSContainer } from '@frontend/ids-react-ts'
import React, { createContext, useCallback, useMemo, useState } from 'react'
import { getTableSorter } from '../../utils/getTableSorter'

interface TableOptions {
  ascending?: boolean
  sortColumn?: string
}

function useTable(options: TableOptions) {
  const [ascending, setAscending] = useState(options.ascending ?? false)
  const [sortColumn, setSortColumn] = useState(options.sortColumn ?? '')

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

export function Table({ children, ...options }: { children: React.ReactNode } & TableOptions) {
  const table = useTable(options)

  return (
    <TableContext.Provider value={table}>
      <IDSContainer gutterless className="overflow-auto pb-4 pt-1">
        <div className="relative">
          <table className="ids-table w-full overflow-visible whitespace-nowrap border-none text-sm">{children}</table>
        </div>
      </IDSContainer>
    </TableContext.Provider>
  )
}
