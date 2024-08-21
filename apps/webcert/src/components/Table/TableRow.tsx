import React, { forwardRef } from 'react'

interface Props extends React.HTMLAttributes<HTMLTableRowElement> {
  children?: React.ReactNode
}

export const TableRow = forwardRef<HTMLTableRowElement, Props>(({ children, ...props }, ref) => (
  <tr ref={ref} {...props}>
    {children}
  </tr>
))
