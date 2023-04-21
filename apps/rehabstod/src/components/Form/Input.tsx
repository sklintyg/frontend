/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { classNames } from '../../utils/classNames'

interface InputProps {
  hasIcon?: boolean
  error?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, React.HTMLProps<HTMLInputElement> & InputProps>(
  ({ hasIcon, error = false, ...props }, ref) => (
    <input
      ref={ref}
      className={classNames(
        'border-accent-40 text-neutral-20 bg-secondary-95 box-border w-full rounded border py-3 text-left my-3',
        hasIcon ? 'pl-5 pr-12' : 'px-5',
        error && 'bg-error-99 border-error-40'
      )}
      {...props}
    />
  )
)

Input.displayName = 'Input'
