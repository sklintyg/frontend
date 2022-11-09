import React, { ChangeEvent } from 'react'
import classNames from 'classnames'
import styled from 'styled-components'

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
  const Wrapper = props.height
    ? styled.div`
        min-height: ${props.height} !important;
      `
    : styled.div``

  const StyledSelect = props.height
    ? styled.select`
        height: ${props.height} !important;
      `
    : styled.select``

  const { onChange, label, name, id, value, hasValidationError, options, disabled } = props
  return (
    <>
      {label !== 'undefined' ? <label htmlFor={id}>{label}</label> : null}
      <Wrapper
        className={classNames('ic-forms__select', {
          'iu-border-error dropdown': hasValidationError,
          dropdown: !hasValidationError,
          'ic-forms__select--disabled': disabled,
        })}>
        <StyledSelect value={value} name={name} id={id} disabled={disabled} onChange={onChange}>
          {options}
        </StyledSelect>
      </Wrapper>
    </>
  )
}

export default Dropdown
