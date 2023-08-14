import { forwardRef } from 'react'
import { classNames } from '../utils/classNames'
import { useInputStyle } from './hooks/useInputStyle'

interface InputProps {
  hasIcon?: boolean
  error?: boolean
  disabled?: boolean
  bright?: boolean
}

export const Input = forwardRef<HTMLInputElement, React.HTMLProps<HTMLInputElement> & InputProps>(
  ({ hasIcon, error = false, disabled = false, bright = false, ...props }, ref) => {
    const style = useInputStyle({ error, disabled, bright })
    return <input ref={ref} className={classNames(style, 'py-3', hasIcon ? 'pl-5 pr-12' : 'px-5')} disabled={disabled} {...props} />
  }
)

Input.displayName = 'Input'
