/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { classNames } from '../../utils/classNames'

interface InputProps {
  hasIcon?: boolean
  error?: boolean
  disabled?: boolean
}

const getStyle = ({ error, disabled }: Record<string, boolean>) => {
  if (error) {
    return 'bg-error-99 border-error-40'
  }

  if (disabled) {
    return 'bg-white border-neutral-40'
  }

  return 'bg-secondary-95 border-accent-40'
}

export const Input = React.forwardRef<HTMLInputElement, React.HTMLProps<HTMLInputElement> & InputProps>(
  ({ hasIcon, error = false, disabled = false, ...props }, ref) => (
    <input
      ref={ref}
      className={classNames(
        'text-neutral-20 box-border w-full rounded border py-3 text-left my-3',
        hasIcon ? 'pl-5 pr-12' : 'px-5',
        getStyle({ error, disabled })
      )}
      {...props}
    />
  )
)

Input.displayName = 'Input'
