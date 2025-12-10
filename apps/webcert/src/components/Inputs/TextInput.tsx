import type { ReactNode } from 'react'
import React, { useId } from 'react'
import type { FlattenSimpleInterpolation } from 'styled-components'
import { FieldLabel } from './FieldLabel'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  italicLabel?: boolean
  limit?: number
  hasValidationError?: boolean
  css?: FlattenSimpleInterpolation
  tooltip?: ReactNode
  showAsterix?: boolean
}

const TextInput = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      italicLabel,
      id: controlledId,
      limit,
      className,
      hasValidationError,
      css,
      autoComplete,
      tooltip,
      showAsterix,
      required,
      ...props
    },
    ref
  ) => {
    const uncontrolledId = useId()
    const id = controlledId ?? uncontrolledId

    return (
      <div>
        {label && <FieldLabel id={id} label={label} tooltip={tooltip} required={showAsterix && required} italic={italicLabel} />}
        <input
          ref={ref}
          className={`${hasValidationError ? 'ic-textfield--error error' : ''} ic-textfield ${className}`}
          maxLength={limit ? limit : 3500}
          autoComplete={autoComplete ?? 'off'}
          required={required}
          id={id}
          css={css}
          {...props}
        />
      </div>
    )
  }
)

export default TextInput
