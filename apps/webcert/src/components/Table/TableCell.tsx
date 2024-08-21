import React, { forwardRef, useContext } from 'react'
import { TableHeaderContext } from './TableHeader'

interface Props extends React.HTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode
  scope?: 'col' | 'row'
}

export const TableCell = forwardRef<HTMLTableCellElement | HTMLTableHeaderCellElement, Props>(({ children, ...props }, ref) => {
  const headerContext = useContext(TableHeaderContext)
  if (headerContext) {
    return (
      <th ref={ref} scope="col" {...props}>
        {children}
      </th>
    )
  }
  return (
    <td ref={ref} {...props}>
      {children}
    </td>
  )
})
