import { forwardRef } from 'react'

interface Props extends React.HTMLAttributes<HTMLTableSectionElement> {
  children?: React.ReactNode
}

export const TableBody = forwardRef<HTMLTableSectionElement, Props>(({ children, ...props }, ref) => (
  <tbody ref={ref} {...props}>
    {children}
  </tbody>
))
