import { useState } from 'react'
import styled from 'styled-components'
import type { FlattenSimpleInterpolation } from 'styled-components/macro'
import { ChevronDownIcon, ChevronUpIcon } from '../../images'
import { sanitizeText } from '../../utils'

const StyledLink = styled.button`
  display: flex;
  align-items: center;
`

export function ExpandableText({
  text,
  maxLength,
  additionalStyles,
}: {
  text?: string
  maxLength: number
  additionalStyles?: FlattenSimpleInterpolation
}) {
  const isExpandable = text && text.length > maxLength
  const [expand, setExpand] = useState(isExpandable ? false : true)
  const buttonLabel = expand ? 'Visa mindre' : 'Visa mer'

  if (!text || text.length === 0) {
    return null
  }

  return (
    <>
      <p
        dangerouslySetInnerHTML={sanitizeText(expand ? text : text.substring(0, text.lastIndexOf(' ', maxLength)))}
        css={additionalStyles}
      />
      {isExpandable && (
        <StyledLink type="button" aria-label={buttonLabel} className="ic-link" onClick={() => setExpand(!expand)}>
          {buttonLabel}
          {expand ? <ChevronUpIcon size="sm" className="iu-ml-200" /> : <ChevronDownIcon size="sm" className="iu-ml-200" />}
        </StyledLink>
      )}
    </>
  )
}
