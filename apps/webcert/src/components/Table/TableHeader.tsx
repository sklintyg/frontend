import { createContext, forwardRef } from 'react'

export const TableHeaderContext = createContext(false)

interface Props extends React.HTMLAttributes<HTMLTableSectionElement> {
  children?: React.ReactNode
}

export const TableHeader = forwardRef<HTMLTableSectionElement, Props>(({ children, ...props }, ref) => (
  <TableHeaderContext.Provider value={true}>
    <thead ref={ref} {...props}>
      {children}
    </thead>
  </TableHeaderContext.Provider>
))
