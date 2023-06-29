import { HTMLProps, forwardRef } from 'react'

export const SelectMultipleActions = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(({ children }, ref) => (
  <div ref={ref} className="pt-2">
    <div className="border-neutral-90 flex grow items-center border-t pt-3">{children}</div>
  </div>
))

SelectMultipleActions.displayName = 'SelectMultipleActions'
