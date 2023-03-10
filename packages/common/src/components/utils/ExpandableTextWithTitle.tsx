import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ChevronDownIcon, ChevronUpIcon } from '../../images'

const StyledLink = styled.a`
  display: flex;
  white-space: nowrap;
`

const LinkWrapper = styled.div`
  min-width: 100px;
`

const TitleBox = styled.div`
  display: flex;
  justify-content: space-between;
`

const Root = styled.div`
  width: 100%;
`

interface Props {
  text: string
  title: string
}

export const ExpandableTextWithTitle: React.FC<Props> = ({ text, title }) => {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    setExpanded(false)
  }, [text])

  return (
    <Root>
      <TitleBox>
        <p>{title}</p>
        <LinkWrapper>
          <StyledLink href="#" onClick={() => setExpanded(!expanded)}>
            <p>{expanded ? 'Visa mindre' : 'Visa mer'}</p>
            {expanded ? (
              <>
                <ChevronUpIcon size="sm" className="iu-ml-200" style={{ height: 'auto' }} />
              </>
            ) : (
              <ChevronDownIcon size="sm" className="iu-ml-200" style={{ height: 'auto' }} />
            )}
          </StyledLink>
        </LinkWrapper>
      </TitleBox>
      <div>{expanded && <p>{text}</p>}</div>
    </Root>
  )
}

export default ExpandableTextWithTitle
