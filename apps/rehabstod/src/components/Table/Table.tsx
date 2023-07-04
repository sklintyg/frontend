import { IDSContainer } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'
import { mergeRefs } from 'react-merge-refs'
import useResizeObserver from 'use-resize-observer'
import { FloatingTableScroll } from '../FloatingScroll/FloatingTableScroll'
import { TableContext, TableOptions, useTable } from './hooks/useTable'
import { useTableContext } from './hooks/useTableContext'

function TableWrapper({ children }: { children: ReactNode }) {
  const { ref } = useResizeObserver<HTMLDivElement>()
  const tableContext = useTableContext()
  const mergedRefCallback = mergeRefs([
    ref,
    (element: HTMLDivElement) => {
      if (element) {
        tableContext.setTableWidth(element.getBoundingClientRect().width)
      }
    },
  ])
  return (
    <div ref={mergedRefCallback} className="relative pb-4 pt-1">
      {children}
    </div>
  )
}

export function Table({ children, print, ...options }: { children?: ReactNode; print?: ReactNode } & TableOptions) {
  const table = useTable(options)

  return (
    <TableContext.Provider value={table}>
      <IDSContainer gutterless className="print:hidden">
        <FloatingTableScroll>
          <TableWrapper>
            <table className="ids-table w-full overflow-visible whitespace-nowrap border-none text-sm">{children}</table>
          </TableWrapper>
        </FloatingTableScroll>
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
