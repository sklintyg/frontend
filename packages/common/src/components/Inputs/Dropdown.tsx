import React, { ChangeEvent } from 'react'
import classNames from 'classnames'
import styled from 'styled-components'

const DropdownDiv = styled.div`
  min-height: 2.956rem !important;
`

const DropdownSelect = styled.select`
  height: 2.956rem !important;
`

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
      <DropdownDiv
        className={classNames('ic-forms__select', {
          'iu-border-error dropdown': hasValidationError,
          dropdown: !hasValidationError,
          'ic-forms__select--disabled': disabled,
        })}>
        <DropdownSelect value={value} name={name} id={id} disabled={disabled} onChange={onChange}>
          {options}
        </DropdownSelect>
      </DropdownDiv>
    </>
  )
}

export default Dropdown
