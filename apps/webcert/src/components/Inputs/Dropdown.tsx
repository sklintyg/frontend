import classNames from 'classnames'
import React, { forwardRef } from 'react'
import styled from 'styled-components'

const DropdownDiv = styled.div<{ fullWidth: boolean }>`
  min-height: 3rem !important;
  max-width: ${(props) => (props.fullWidth ? 'none' : '30ch')} !important;
`

const DropdownSelect = styled.select`
  height: 3rem !important;
  padding-right: 3.15rem !important;
  text-overflow: ellipsis;
  cursor: pointer;
`

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode
  error?: boolean
  label?: string
  fullWidth?: boolean
}

const Dropdown = forwardRef<HTMLSelectElement, Props>(
  ({ children, id, error, disabled, title, label, value, fullWidth, ...props }, ref) => (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <DropdownDiv
        title={title}
        className={classNames('ic-forms__select', {
          'iu-border-error dropdown': error,
          dropdown: !error,
          'ic-forms__select--disabled': disabled,
        })}
        fullWidth={fullWidth ?? false}
      >
        <DropdownSelect ref={ref} id={id} disabled={disabled} value={value ?? ''} {...props}>
          {children}
        </DropdownSelect>
      </DropdownDiv>
    </>
  )
)

export default Dropdown
