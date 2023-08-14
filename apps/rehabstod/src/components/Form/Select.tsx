/* eslint-disable react/jsx-props-no-spreading */
import { classNames, useInputStyle } from '@frontend/components'
import React from 'react'

interface SelectProps {
  error?: boolean
  disabled?: boolean
}

export const Select = React.forwardRef<HTMLSelectElement, React.HTMLProps<HTMLSelectElement> & SelectProps>(
  ({ error = false, disabled = false, ...props }, ref) => {
    const style = useInputStyle({ error, disabled })
    return <select ref={ref} className={classNames(style, 'py-3', 'appearance-none', 'pl-5 pr-12')} disabled={disabled} {...props} />
  }
)

Select.displayName = 'Select'
