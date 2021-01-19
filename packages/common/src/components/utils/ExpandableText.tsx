import React, { MouseEvent, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const StyledLink = styled(Link)`
  display: flex;
  font-size: 14px;
  color: 'inherit';
  align-items: bottom;
`

const TextWrapper = styled.div`
  p + p {
    margin-top: 14px;
    margin-bottom: 0;
  }
  p:first-child {
    margin-top: 0;
    margin-bottom: 0;
  }
`

interface Props {
  text: string
  maxLength: number
}

export const ExpandableText: React.FC<Props> = ({ text, maxLength }) => {
  const [expand, setExpand] = useState(false)

  useEffect(() => {
    setExpand(false)
  }, [text])

  const onReadLessOrMore = (event: MouseEvent) => {
    setExpand(!expand)
  }

  const trimToLastCompleteWord = (text: string, maxLength: number) => {
    return text.substr(0, text.lastIndexOf(' ', maxLength))
  }

  return (
    <>
      {!expand && text && text.length > maxLength ? (
        <div>
          <TextWrapper dangerouslySetInnerHTML={{ __html: trimToLastCompleteWord(text, maxLength) }} />
          <StyledLink to="#" onClick={onReadLessOrMore}>
            Läs mer
            <FontAwesomeIcon icon={faAngleDown} />
          </StyledLink>
        </div>
      ) : (
        <div>
          <TextWrapper dangerouslySetInnerHTML={{ __html: text }} />
          {text && text.length > maxLength && (
            <StyledLink to="#" onClick={onReadLessOrMore}>
              Läs mindre
              <FontAwesomeIcon icon={faAngleDown} rotation={180} />
            </StyledLink>
          )}
        </div>
      )}
    </>
  )
}

export default ExpandableText
