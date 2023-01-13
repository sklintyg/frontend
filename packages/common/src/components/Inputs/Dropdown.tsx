import React, { forwardRef } from 'react'
import classNames from 'classnames'
import styled from 'styled-components'

const DropdownDiv = styled.div`
  min-height: 3rem !important;
`

const DropdownSelect = styled.select`
  height: 3rem !important;
  padding-right: 3.15rem !important;
  text-overflow: ellipsis;
`

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode
  error?: boolean
  label?: string
}

const Dropdown = forwardRef<HTMLSelectElement, Props>(({ children, id, error, disabled, title, label, ...props }, ref) => (
  <>
    {label !== null ? <label htmlFor={id}>{label}</label> : null}
    <DropdownDiv
      title={title}
      className={classNames('ic-forms__select', {
        'iu-border-error dropdown': error,
        dropdown: !error,
        'ic-forms__select--disabled': disabled,
      })}>
      <DropdownSelect ref={ref} id={id} disabled={disabled} {...props}>
        {children}
      </DropdownSelect>
    </DropdownDiv>
  </>
))

export default Dropdown
