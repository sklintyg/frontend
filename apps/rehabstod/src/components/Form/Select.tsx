/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
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
  ({ error = false, disabled = false, ...props }, ref) => (
    <select
      ref={ref}
      className={classNames(
        'text-neutral-20 appearance-none truncate box-border w-full rounded border py-3 text-left my-3 pl-5 pr-12',
        getStyle({ error, disabled })
      )}
      disabled={disabled}
      {...props}
    />
  )
)

Select.displayName = 'Select'
