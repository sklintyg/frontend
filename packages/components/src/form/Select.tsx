import { IDSSelect } from '@frontend/ids-react-ts'
import { forwardRef } from 'react'

interface SelectProps {
  label: string
}

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & SelectProps>(
  ({ children, id, label, ...props }, ref) => (
    <IDSSelect>
      <label htmlFor={id}>{label}</label>
      <select ref={ref} id={id} {...props}>
        {children}
      </select>
    </IDSSelect>
  )
)

Select.displayName = 'Select'
