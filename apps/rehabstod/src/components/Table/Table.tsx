/* eslint-disable react/jsx-props-no-spreading */
import { IDSContainer } from '@frontend/ids-react-ts'
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
      <IDSContainer gutterless className="overflow-auto p-1">
        <div className="border-neutral-40 relative rounded-md border">
          <table className="ids-table w-full overflow-visible whitespace-nowrap rounded-md border-none text-sm">{children}</table>
        </div>
      </IDSContainer>
    </TableContext.Provider>
  )
}
