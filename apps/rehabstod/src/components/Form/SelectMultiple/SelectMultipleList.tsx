import { IDSCheckboxGroup, IDSCheckboxGroupElement } from '@frontend/ids-react-ts'
import { HTMLProps, forwardRef } from 'react'

export const SelectMultipleList = forwardRef<IDSCheckboxGroupElement, HTMLProps<IDSCheckboxGroupElement>>(({ children }, ref) => (
  <div className="relative max-h-96 overflow-auto py-1">
    <IDSCheckboxGroup ref={ref} compact>
      {children}
    </IDSCheckboxGroup>
  </div>
))

SelectMultipleList.displayName = 'SelectMultipleList'
