import type React from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import ArrowToggle from './ArrowToggle'

const LinkButton = styled.button`
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
  isExpanded: boolean
}

const ExpandableBox: React.FC<Props> = ({ isExpanded, linkText, onClickLink }) => {
  const [isExpandedBox, setIsExpandedBox] = useState(false)

  const handleToggle = () => {
    setIsExpandedBox(!isExpandedBox)
  }

  const handleClick = () => {
    onClickLink()
    setIsExpandedBox(false)
  }

  return (
    <RelativeDiv>
      <ArrowToggle onClick={handleToggle} className="iu-ml-300" isUp={isExpanded} />
      {isExpanded && (
        <ExpandedDiv>
          <LinkButton className="ic-link" type="button" onClick={handleClick}>
            {linkText}
          </LinkButton>
        </ExpandedDiv>
      )}
    </RelativeDiv>
  )
}

export default ExpandableBox
