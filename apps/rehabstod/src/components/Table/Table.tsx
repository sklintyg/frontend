import { IDSContainer } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'
import { FloatingTableScroll } from '../FloatingScroll/FloatingTableScroll'
import { TableContentDiv } from './TableContentDiv'
import { TableContext, TableOptions, useTable } from './hooks/useTable'

export function Table({ children, print, ...options }: { children?: ReactNode; print?: ReactNode } & TableOptions) {
  const table = useTable(options)

  return (
    <TableContext.Provider value={table}>
      <IDSContainer gutterless className="print:hidden">
        <FloatingTableScroll>
          <TableContentDiv>
            <table className="ids-table w-full overflow-visible whitespace-nowrap border-none text-sm">{children}</table>
          </TableContentDiv>
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
