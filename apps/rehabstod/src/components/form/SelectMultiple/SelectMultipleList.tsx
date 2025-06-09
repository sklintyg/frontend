import type { IDSCheckboxGroup as IDSCheckboxGroupElement } from '@inera/ids-core/components/form/checkbox/checkbox-group-element.js'
import { IDSCheckboxGroup } from '@inera/ids-react'
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
