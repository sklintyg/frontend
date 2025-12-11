import type { ReactNode } from 'react'
import React, { useId } from 'react'
import type { FlattenSimpleInterpolation } from 'styled-components'
import { FieldLabel } from './FieldLabel'
import { classNames } from '@frontend/components'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  limit?: number
  hasValidationError?: boolean
  css?: FlattenSimpleInterpolation
  tooltip?: ReactNode
  showAsterix?: boolean
}

const TextInput = React.forwardRef<HTMLInputElement, Props>(
  ({ label, id: controlledId, limit, className, hasValidationError, css, autoComplete, tooltip, showAsterix, required, ...props }, ref) => {
    const uncontrolledId = useId()
    const id = controlledId ?? uncontrolledId

    return (
      <div>
        {label && <FieldLabel id={id} label={label} tooltip={tooltip} italic={props.disabled} required={showAsterix && required} />}
        <input
          ref={ref}
          className={classNames(hasValidationError && 'ic-textfield--error error', 'ic-textfield',  props.disabled && 'italic', className)}
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
