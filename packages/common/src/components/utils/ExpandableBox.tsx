import React, { useState } from 'react'
import styled from 'styled-components'
import ArrowToggle from './ArrowToggle'

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
  flex-shrink: 0;
`

interface Props {
  linkText: string
  onClickLink: () => void
}

const ExpandableBox: React.FC<Props> = ({ linkText, onClickLink }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const handleClick = () => {
    onClickLink()
    setIsExpanded(false)
  }

  return (
    <RelativeDiv>
      <ArrowToggle onClick={handleToggle} className="iu-ml-300" isUp={isExpanded} />
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
