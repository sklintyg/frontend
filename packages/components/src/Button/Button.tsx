/* eslint-disable react/button-has-type */
import { IDSButton, IDSSpinner } from '@inera/ids-react'
import type { ButtonHTMLAttributes, ComponentProps, ForwardedRef } from 'react'
import { forwardRef } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & Omit<ComponentProps<typeof IDSButton>, 'ref' | 'onclick'>

export const Button = forwardRef(({ children, loading, ...props }: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => (
  <IDSButton ref={ref} loading={loading} {...props}>
    {loading ? <IDSSpinner light /> : children}
  </IDSButton>
))

Button.displayName = 'Button'
