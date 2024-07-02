import type { HTMLProps} from 'react';
import { forwardRef } from 'react'

export const SelectMultipleActions = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(({ children }, ref) => (
  <div ref={ref} className="pt-2">
    <div className="flex grow items-center border-t border-neutral-90 pt-3">{children}</div>
  </div>
))

SelectMultipleActions.displayName = 'SelectMultipleActions'
