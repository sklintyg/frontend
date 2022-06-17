import React from 'react'
import styled from 'styled-components'
import arrow from '@frontend/common/src/images/arrow-down.svg'

const StyledButton = styled.button`
  border: none;
  background: none;
`

const ArrowDown = styled.img`
  cursor: pointer;
  width: 0.9em;
  display: inline-block;
`

const ArrowUp = styled(ArrowDown)`
  transform: rotate(180deg);
`

interface Props {
  onClick: () => void
  className?: string
  isUp: boolean
  label: string
}

const ArrowToggle: React.FC<Props> = ({ onClick, className, isUp, label }) => {
  return (
    <StyledButton onClick={onClick} tabIndex={0} className={className} data-testid="arrowToggle">
      {isUp ? <ArrowUp src={arrow} alt="" /> : <ArrowDown src={arrow} alt="" />}
      <span className="iu-sr-only">{label}</span>
    </StyledButton>
  )
}

export default ArrowToggle
