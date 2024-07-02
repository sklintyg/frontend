import classNames from 'classnames'
import type { MouseEventHandler, ReactNode } from 'react'
import styled from 'styled-components'

const StyledPaginationButton = styled.button<{ active: boolean }>`
  background: none !important;
  border: none;
  color: #5f5f5f;
  font-family: inherit;
  line-height: inherit;
  ${({ active }) => active && 'text-decoration: underline;'}

  &:hover {
    color: #01a5a3;
  }

  &:disabled {
    cursor: text;
    font-style: italic;
  }
`

export function PaginationButton({
  disabled = false,
  active = false,
  onClick,
  children,
}: {
  disabled?: boolean
  active?: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
  children: ReactNode
}) {
  return (
    <StyledPaginationButton
      type="button"
      disabled={disabled}
      active={active}
      className={classNames('iu-px-200', { 'iu-color-grey-400': disabled, 'iu-color-main iu-fw-heading': active })}
      onClick={(e) => {
        if (!disabled) {
          onClick(e)
        }
      }}
    >
      {children}
    </StyledPaginationButton>
  )
}
