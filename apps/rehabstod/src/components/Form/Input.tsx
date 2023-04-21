/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { classNames } from '../../utils/classNames'

interface InputProps {
  hasIcon?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, React.HTMLProps<HTMLInputElement> & InputProps>(({ hasIcon, ...props }, ref) => (
  <input
    ref={ref}
    className={classNames(
      'border-accent-40 text-neutral-20 bg-secondary-95 box-border w-full rounded border py-3 text-left my-3',
      hasIcon ? 'pl-5 pr-12' : 'px-5'
    )}
    {...props}
  />
))

Input.displayName = 'Input'
