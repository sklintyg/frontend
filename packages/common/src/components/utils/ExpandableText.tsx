import React, { MouseEvent, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const StyledLink = styled(Link)`
  display: flex;
  align-items: bottom;
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
          <p dangerouslySetInnerHTML={{ __html: trimToLastCompleteWord(text, maxLength) }} />
          <StyledLink to="#" onClick={onReadLessOrMore}>
            Visa mer
            <FontAwesomeIcon icon={faAngleDown} className={'iu-mt-200 iu-ml-200'} />
          </StyledLink>
        </div>
      ) : (
        <div>
          <p dangerouslySetInnerHTML={{ __html: text }} />
          {text && text.length > maxLength && (
            <StyledLink to="#" onClick={onReadLessOrMore}>
              Visa mindre
              <FontAwesomeIcon icon={faAngleDown} rotation={180} className={'iu-mt-200 iu-ml-200'} />
            </StyledLink>
          )}
        </div>
      )}
    </>
  )
}

export default ExpandableText
