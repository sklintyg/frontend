/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { useInputStyle } from './hooks/useInputStyle'
import { classNames } from '../../utils/classNames'

interface SelectProps {
  error?: boolean
  disabled?: boolean
}

const getStyle = ({ error, disabled }: Record<string, boolean>) => {
  if (disabled) {
    return 'bg-white border-neutral-40'
  }

  if (error) {
    return 'bg-error-99 border-error-40'
  }

  return 'bg-secondary-95 border-accent-40'
}

export const Select = React.forwardRef<HTMLSelectElement, React.HTMLProps<HTMLSelectElement> & SelectProps>(
  ({ error = false, disabled = false, ...props }, ref) => {
    const style = useInputStyle({ error, disabled })
    return <select ref={ref} className={classNames(style, 'py-3', 'appearance-none', 'pl-5 pr-12')} disabled={disabled} {...props} />
  }
)

Select.displayName = 'Select'
