import React, { ChangeEvent } from 'react'
import classNames from 'classnames'

interface Props {
  label?: string
  name?: string
  value?: string
  options: React.ReactNode
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void
  hasValidationError?: boolean
  disabled?: boolean
  id: string
}

const Dropdown: React.FC<Props> = (props) => {
  const { onChange, label, name, id, value, hasValidationError, options, disabled } = props
  return (
    <>
      {label !== 'undefined' ? <label htmlFor={id}>{label}</label> : null}
      <div
        className={classNames('ic-forms__select', {
          'iu-border-error dropdown': hasValidationError,
          dropdown: !hasValidationError,
          'ic-forms__select--disabled': disabled,
        })}>
        <select value={value} name={name} id={id} disabled={disabled} onChange={onChange}>
          {options}
        </select>
      </div>
    </>
  )
}

export default Dropdown
