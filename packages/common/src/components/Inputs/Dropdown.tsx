import React, { ChangeEvent } from 'react'
import classNames from 'classnames'
import styled from 'styled-components'
import { css } from 'styled-components/macro'

const DropdownDiv = styled.div<{ height?: string }>`
  ${(props) =>
    props.height &&
    css`
      height: ${props.height} !important;
      min-height: ${props.height} !important;
    `}
`

const DropdownSelect = styled.select<{ height?: string }>`
  ${(props) =>
    props.height &&
    css`
      height: ${props.height} !important;
      min-height: ${props.height} !important;
    `}
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
  height?: string
}

const Dropdown: React.FC<Props> = (props) => {
  const { onChange, label, name, id, value, hasValidationError, options, disabled, height } = props

  return (
    <>
      {label !== 'undefined' ? <label htmlFor={id}>{label}</label> : null}
      <DropdownDiv
        height={height}
        className={classNames('ic-forms__select', {
          'iu-border-error dropdown': hasValidationError,
          dropdown: !hasValidationError,
          'ic-forms__select--disabled': disabled,
        })}>
        <DropdownSelect height={height} value={value} name={name} id={id} disabled={disabled} onChange={onChange}>
          {options}
        </DropdownSelect>
      </DropdownDiv>
    </>
  )
}

export default Dropdown
