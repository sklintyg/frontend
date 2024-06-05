import { IDSInput } from '@frontend/ids-react-ts'
import { ReactNode, forwardRef, useId } from 'react'
import { classNames } from '../utils'
import { InputLabel } from './InputLabel'

interface InputProps {
  error?: boolean
  disabled?: boolean
  light?: boolean
  label: ReactNode
  icon?: ReactNode
  description?: string
  inline?: boolean
}

export const Input = forwardRef<HTMLInputElement, React.HTMLProps<HTMLInputElement> & InputProps>(
  ({ description, disabled = false, error = false, icon, id: controlledId, label, light = false, inline = false, ...props }, ref) => {
    const uncontrolledId = useId()
    const id = controlledId ?? uncontrolledId

    return (
      <IDSInput
        isDisabled={disabled}
        light={light}
        invalid={error}
        hasIcon={Boolean(icon)}
        className={classNames('my-0', inline && 'flex items-baseline gap-3')}
      >
        {label && (
          <InputLabel htmlFor={id} description={description}>
            {label}
          </InputLabel>
        )}
        <input
          ref={ref}
          {...props}
          id={id}
          disabled={disabled}
          className={classNames(
            'text-left whitespace-nowrap text-ellipsis overflow-hidden',
            !error && 'bg-[--input_background]',
            Boolean(icon) && 'pr-[50px]',
            props.className ?? ''
          )}
        />
        {icon}
      </IDSInput>
    )
  }
)

Input.displayName = 'Input'
