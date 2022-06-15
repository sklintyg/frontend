import React, { useState } from 'react'
import styled from 'styled-components'
import arrow from '@frontend/common/src/images/arrow-down.svg'

interface Props {
  linkText: string
  onClick: () => void
}

const ExpandableBox: React.FC<Props> = ({ linkText, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const ArrowDown = styled.img`
    cursor: pointer;
    width: 0.9em;
    display: inline-block;
  `

  const ArrowUp = styled(ArrowDown)`
    transform: rotate(180deg);
  `

  const StyledButton = styled.button`
    border: none;
  `

  const Link = styled.button`
    text-decoration: none;
  `

  const ExpandedDiv = styled.div`
    position: absolute;
    background: #ffffff;
    padding: 1em 1.7em;
    box-shadow: 1px 1px 10px #ccc;
    right: -11px;
    margin-top: 1em;
    border-radius: 3px;
    z-index: 9999;
    white-space: nowrap;

    &::before {
      content: '';
      width: 10px;
      height: 10px;
      background: #ffffff;
      transform: rotate(45deg);
      position: absolute;
      top: -5px;
      right: 12px;
    }
  `
  const RelativeDiv = styled.div`
    position: relative;
  `

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const handleClick = () => {
    onClick()
    setIsExpanded(false)
  }

  return (
    <RelativeDiv>
      <StyledButton onClick={handleToggle} tabIndex={0} className="iu-ml-300" data-testid="expandChangeUnit">
        {isExpanded ? <ArrowUp src={arrow} alt="" data-testid="expandArrow" /> : <ArrowDown src={arrow} alt="" data-testid="expandArrow" />}
      </StyledButton>
      {isExpanded && (
        <ExpandedDiv>
          <Link className="ic-link" type="button" onClick={handleClick}>
            {linkText}
          </Link>
        </ExpandedDiv>
      )}
    </RelativeDiv>
  )
}

export default ExpandableBox
