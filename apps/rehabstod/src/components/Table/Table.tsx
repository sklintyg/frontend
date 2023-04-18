/* eslint-disable react/jsx-props-no-spreading */
import React, { createContext, useCallback, useMemo, useState } from 'react'
import { getTableSorter } from '../../utils/getTableSorter'

interface TableOptions {
  ascending?: boolean
  column?: string
}

function useTable(options: TableOptions) {
  const [ascending, setAscending] = useState(options.ascending ?? false)
  const [column, setColumn] = useState(options.column ?? '')

  const sortOnColumn = useCallback(
    (desiredColumn: string) => {
      if (desiredColumn !== column) {
        setColumn(desiredColumn)
        setAscending(options.ascending ?? false)
      } else {
        setAscending(!ascending)
      }
    },
    [ascending, column, options.ascending]
  )

  const sortTableList = getTableSorter(column, ascending)

  return useMemo(
    () => ({
      ascending,
      column,
      sortOnColumn,
      sortTableList,
    }),
    [ascending, column, sortOnColumn, sortTableList]
  )
}

export const TableContext = createContext<ReturnType<typeof useTable> | null>(null)

export function Table({ children, ...options }: { children: React.ReactNode } & TableOptions) {
  const table = useTable(options)

  return (
    <TableContext.Provider value={table}>
      <table className="ids-table w-full whitespace-nowrap rounded-md text-sm">{children}</table>
    </TableContext.Provider>
  )
}
