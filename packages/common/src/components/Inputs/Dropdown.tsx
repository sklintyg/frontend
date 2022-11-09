import React, { ChangeEvent } from 'react'
import classNames from 'classnames'
import { css } from 'styled-components/macro'

interface Props {
  label?: string
  name?: string
  value?: string
  options: React.ReactNode
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void
  hasValidationError?: boolean
  disabled?: boolean
  id: string
  height?: string
}

const Dropdown: React.FC<Props> = (props) => {
  const { onChange, label, name, id, value, hasValidationError, options, disabled } = props

  const heightStyle = props.height
    ? css`
        height: ${props.height} !important;
        min-height: ${props.height} !important;
      `
    : css``

  return (
    <>
      {label !== 'undefined' ? <label htmlFor={id}>{label}</label> : null}
      <div
        css={heightStyle}
        className={classNames('ic-forms__select', {
          'iu-border-error dropdown': hasValidationError,
          dropdown: !hasValidationError,
          'ic-forms__select--disabled': disabled,
        })}>
        <select css={heightStyle} value={value} name={name} id={id} disabled={disabled} onChange={onChange}>
          {options}
        </select>
      </div>
    </>
  )
}

export default Dropdown
