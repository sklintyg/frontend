import { forwardRef } from 'react'

interface Props extends React.HTMLAttributes<HTMLTableElement> {
  children?: React.ReactNode
}

export const Table = forwardRef<HTMLTableElement, Props>(({ children, ...props }, ref) => (
  <table className="ic-table iu-fullwidth" ref={ref} {...props}>
    {children}
  </table>
))
