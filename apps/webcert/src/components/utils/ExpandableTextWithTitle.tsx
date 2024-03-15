import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ChevronDownIcon, ChevronUpIcon } from '../../images'
import { LinkButton } from '../../styles'

const LinkWrapper = styled.div`
  min-width: 100px;
  margin-left: 10px;
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
  onClick?: (currentExpanded: boolean) => void
}

export const ExpandableTextWithTitle: React.FC<Props> = ({ text, title, onClick }) => {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    setExpanded(false)
  }, [text])

  const handleOnClick = () => {
    if (onClick) {
      onClick(!expanded)
    }

    setExpanded(!expanded)
  }

  return (
    <Root>
      <TitleBox>
        <p>{title}</p>
        <LinkWrapper>
          <LinkButton onClick={handleOnClick} className="ic-link">
            {expanded ? 'Visa mindre' : 'Visa mer'}
            {expanded ? (
              <>
                <ChevronUpIcon size="sm" className="iu-ml-200" style={{ height: 'auto' }} />
              </>
            ) : (
              <ChevronDownIcon size="sm" className="iu-ml-200" style={{ height: 'auto' }} />
            )}
          </LinkButton>
        </LinkWrapper>
      </TitleBox>
      <div>{expanded && <p>{text}</p>}</div>
    </Root>
  )
}
