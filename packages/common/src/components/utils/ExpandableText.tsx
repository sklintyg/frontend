import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FlattenSimpleInterpolation } from 'styled-components/macro'
import { ChevronDownIcon, ChevronUpIcon } from '../../images'
import { sanitizeText } from '../../utils'

const StyledLink = styled.a`
  display: flex;
  align-items: bottom;
`

interface Props {
  text: string
  maxLength: number
  additionalStyles?: FlattenSimpleInterpolation
}

export const ExpandableText: React.FC<Props> = ({ text, maxLength, additionalStyles }) => {
  const [expand, setExpand] = useState(false)

  useEffect(() => {
    setExpand(false)
  }, [text])

  const trimToLastCompleteWord = (text: string, maxLength: number) => {
    return text.substr(0, text.lastIndexOf(' ', maxLength))
  }

  return (
    <>
      {!expand && text && text.length > maxLength ? (
        <div>
          <p dangerouslySetInnerHTML={sanitizeText(trimToLastCompleteWord(text, maxLength))} css={additionalStyles} />
          <StyledLink href="#" onClick={() => setExpand(!expand)}>
            Visa mer
            <ChevronDownIcon size="sm" className="iu-ml-200" style={{ height: 'auto' }} />
          </StyledLink>
        </div>
      ) : (
        <div>
          <p dangerouslySetInnerHTML={sanitizeText(text)} css={additionalStyles} />
          {text && text.length > maxLength && (
            <StyledLink href="#" onClick={() => setExpand(!expand)}>
              Visa mindre
              <ChevronUpIcon size="sm" className="iu-ml-200" style={{ height: 'auto' }} />
            </StyledLink>
          )}
        </div>
      )}
    </>
  )
}
