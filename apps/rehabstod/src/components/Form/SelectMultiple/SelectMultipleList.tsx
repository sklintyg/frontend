import type { IDSCheckboxGroupElement } from '@frontend/ids-react-ts'
import { IDSCheckboxGroup } from '@frontend/ids-react-ts'
import type { HTMLProps } from 'react'
import { forwardRef } from 'react'

export const SelectMultipleList = forwardRef<IDSCheckboxGroupElement, HTMLProps<IDSCheckboxGroupElement>>(({ children }, ref) => (
  <div className="relative max-h-96 overflow-auto py-1 pl-2.5">
    <IDSCheckboxGroup ref={ref} compact>
      {children}
    </IDSCheckboxGroup>
  </div>
))

SelectMultipleList.displayName = 'SelectMultipleList'
