import classNames from 'classnames'
import React, { forwardRef, useEffect } from 'react'
import styled from 'styled-components'

const DropdownDiv = styled.div`
  min-height: 3rem !important;
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
}

const Dropdown = forwardRef<HTMLSelectElement, Props>(({ children, id, error, disabled, title, label, value, ...props }) => {
  const selectRef = React.useRef<HTMLSelectElement>(null)

  useEffect(() => {
    if (!disabled && selectRef.current && selectRef.current.value !== '') {
      const event = new Event('change', { bubbles: true })
      selectRef.current.dispatchEvent(event)
    }
  }, [disabled])

  return (
    <>
      {label !== null ? <label htmlFor={id}>{label}</label> : null}
      <DropdownDiv
        title={title}
        className={classNames('ic-forms__select', {
          'iu-border-error dropdown': error,
          dropdown: !error,
          'ic-forms__select--disabled': disabled,
        })}>
        <DropdownSelect ref={selectRef} id={id} disabled={disabled} value={value ?? ''} {...props}>
          {children}
        </DropdownSelect>
      </DropdownDiv>
    </>
  )
})

export default Dropdown
